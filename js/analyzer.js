/**
 * Brand Analyzer Module
 * Core analysis engine that coordinates rule evaluation and result processing.
 * @module analyzer
 */

/**
 * Analyzer class for brand alignment analysis
 */
class Analyzer {
  /**
   * Creates a new Analyzer instance
   * @param {RulesEngine} rulesEngine - Rules engine instance
   */
  constructor(rulesEngine) {
    this.rulesEngine = rulesEngine;
    this.lastAnalysis = null;
    this.analysisHistory = [];
  }

  /**
   * Performs brand alignment analysis on content
   * @param {Object} params - Analysis parameters
   * @param {string} params.content - Content to analyze
   * @param {string} params.businessUnit - Business unit code
   * @param {string} params.country - Country code
   * @param {string} params.assetType - Asset type
   * @param {string} params.contentType - Content type
   * @returns {Object} Complete analysis results
   */
  analyze(params) {
    const { content, businessUnit, country, assetType, contentType } = params;

    // Validate input
    if (!content || !content.trim()) {
      throw new Error('Content is required for analysis');
    }

    // Perform rule evaluation
    const evaluation = this.rulesEngine.evaluate({
      text: content,
      businessUnit,
      country,
      assetType,
      contentType
    });

    // Determine approval path
    const approval = this.rulesEngine.determineApprovalPath(
      evaluation.scores.total,
      evaluation.issues
    );

    // Generate suggested rewrite
    const suggestedRewrite = this.rulesEngine.generateSuggestedRewrite(
      content,
      evaluation.issues
    );

    // Compile complete analysis
    const analysis = {
      timestamp: new Date().toISOString(),
      parameters: {
        businessUnit,
        country,
        assetType,
        contentType
      },
      originalContent: content,
      scores: evaluation.scores,
      penalties: evaluation.penalties,
      issues: evaluation.issues,
      approval: approval,
      suggestedRewrite: suggestedRewrite,
      statistics: this._calculateStatistics(evaluation.issues)
    };

    // Store in history
    this.lastAnalysis = analysis;
    this._addToHistory(analysis);

    return analysis;
  }

  /**
   * Calculates statistics from issues
   * @private
   */
  _calculateStatistics(issues) {
    const stats = {
      totalIssues: issues.length,
      bySeverity: {
        critical: 0,
        warning: 0,
        info: 0
      },
      byArea: {}
    };

    issues.forEach(issue => {
      // Count by severity
      if (issue.severity) {
        stats.bySeverity[issue.severity] = (stats.bySeverity[issue.severity] || 0) + 1;
      }

      // Count by area
      const area = issue.area || 'Other';
      stats.byArea[area] = (stats.byArea[area] || 0) + 1;
    });

    return stats;
  }

  /**
   * Adds analysis to history with size limit
   * @private
   */
  _addToHistory(analysis) {
    // Keep only essential data in history
    const historyEntry = {
      timestamp: analysis.timestamp,
      parameters: analysis.parameters,
      scores: analysis.scores,
      issueCount: analysis.issues.length,
      approval: analysis.approval
    };

    this.analysisHistory.unshift(historyEntry);

    // Limit history to 50 entries
    if (this.analysisHistory.length > 50) {
      this.analysisHistory = this.analysisHistory.slice(0, 50);
    }
  }

  /**
   * Gets the last analysis result
   * @returns {Object|null} Last analysis or null
   */
  getLastAnalysis() {
    return this.lastAnalysis;
  }

  /**
   * Gets analysis history
   * @returns {Array} Array of historical analyses
   */
  getHistory() {
    return this.analysisHistory;
  }

  /**
   * Clears analysis history
   */
  clearHistory() {
    this.analysisHistory = [];
  }

  /**
   * Exports analysis results to JSON
   * @param {Object} analysis - Analysis to export (defaults to last analysis)
   * @returns {string} JSON string of analysis
   */
  exportToJSON(analysis = null) {
    const data = analysis || this.lastAnalysis;
    if (!data) {
      throw new Error('No analysis to export');
    }
    return JSON.stringify(data, null, 2);
  }

  /**
   * Exports analysis results to a downloadable JSON file
   * @param {Object} analysis - Analysis to export (defaults to last analysis)
   * @param {string} filename - Filename for download
   */
  downloadJSON(analysis = null, filename = 'brand-analysis.json') {
    const json = this.exportToJSON(analysis);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Loads analysis from JSON string
   * @param {string} json - JSON string to parse
   * @returns {Object} Parsed analysis object
   */
  loadFromJSON(json) {
    try {
      const analysis = JSON.parse(json);
      this.lastAnalysis = analysis;
      return analysis;
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  }

  /**
   * Compares two analyses
   * @param {Object} analysis1 - First analysis
   * @param {Object} analysis2 - Second analysis
   * @returns {Object} Comparison results
   */
  compareAnalyses(analysis1, analysis2) {
    return {
      scoreDifference: {
        total: analysis2.scores.total - analysis1.scores.total,
        internal: analysis2.scores.internal - analysis1.scores.internal,
        external: analysis2.scores.external - analysis1.scores.external,
        asset: analysis2.scores.asset - analysis1.scores.asset
      },
      issueCountDifference: analysis2.issues.length - analysis1.issues.length,
      newIssues: this._findNewIssues(analysis1.issues, analysis2.issues),
      resolvedIssues: this._findNewIssues(analysis2.issues, analysis1.issues)
    };
  }

  /**
   * Finds new issues by comparing two issue arrays
   * @private
   */
  _findNewIssues(oldIssues, newIssues) {
    const oldIds = new Set(oldIssues.map(i => i.id || i.phrase));
    return newIssues.filter(issue => {
      const id = issue.id || issue.phrase;
      return !oldIds.has(id);
    });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Analyzer;
}
