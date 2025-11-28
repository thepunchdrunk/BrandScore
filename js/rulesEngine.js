/**
 * Brand Rules Engine
 * Manages and evaluates brand alignment rules against content.
 * @module rulesEngine
 */

/**
 * Rules Engine class for evaluating brand alignment
 */
class RulesEngine {
  /**
   * Creates a new RulesEngine instance
   */
  constructor() {
    this.rules = null;
    this.isLoaded = false;
  }

  /**
   * Loads rules from a JSON file or object
   * @param {string|Object} source - URL to rules JSON file or rules object
   * @returns {Promise<void>}
   */
  async loadRules(source) {
    try {
      if (typeof source === 'string') {
        const response = await fetch(source);
        if (!response.ok) {
          throw new Error(`Failed to load rules: ${response.statusText}`);
        }
        this.rules = await response.json();
      } else {
        this.rules = source;
      }
      this.isLoaded = true;
      console.log('Rules loaded successfully:', this.rules.version);
    } catch (error) {
      console.error('Error loading rules:', error);
      throw error;
    }
  }

  /**
   * Evaluates content against all applicable rules
   * @param {Object} params - Evaluation parameters
   * @param {string} params.text - Content to analyze
   * @param {string} params.businessUnit - Business unit code
   * @param {string} params.country - Country code
   * @param {string} params.assetType - Asset type
   * @param {string} params.contentType - Content type
   * @returns {Object} Evaluation results with scores and issues
   */
  evaluate(params) {
    if (!this.isLoaded || !this.rules) {
      throw new Error('Rules not loaded. Call loadRules() first.');
    }

    const { text, businessUnit, country, assetType, contentType } = params;
    const lowerText = text.toLowerCase();
    
    let internalPenalty = 0;
    let externalPenalty = 0;
    let assetPenalty = 0;
    const issues = [];

    // Check brand tone rules
    this._checkRuleArray(this.rules.brandTone, lowerText, 'internal', 
      internalPenalty, issues, (p) => internalPenalty = p);

    // Check legal claims
    this._checkRuleArray(this.rules.legalClaims, lowerText, 'internal',
      internalPenalty, issues, (p) => internalPenalty = p);

    // Check sustainability rules
    this._checkRuleArray(this.rules.sustainability, lowerText, 'external',
      externalPenalty, issues, (p) => externalPenalty = p);

    // Check technical rules
    this._checkRuleArray(this.rules.technical, lowerText, 'internal',
      internalPenalty, issues, (p) => internalPenalty = p);

    // Check cultural rules by country
    const culturalRules = this.rules.cultural[country] || [];
    this._checkRuleArray(culturalRules, lowerText, 'external',
      externalPenalty, issues, (p) => externalPenalty = p);

    // Check business unit alignment
    const buRule = this.rules.businessUnits[businessUnit];
    if (buRule) {
      const hasTerm = buRule.required.some(term => lowerText.includes(term));
      if (!hasTerm) {
        internalPenalty += buRule.penalty;
        issues.push({
          id: buRule.id,
          area: 'Internal (BU alignment)',
          phrase: '',
          penalty: buRule.penalty,
          severity: buRule.severity,
          message: buRule.message,
          suggestion: buRule.suggestion
        });
      }
    }

    // Check asset-specific rules
    const assetRules = this.rules.assetTypes[assetType] || [];
    this._checkRuleArray(assetRules, lowerText, 'asset',
      assetPenalty, issues, (p) => assetPenalty = p);

    // Check content type specific rules (e.g., disclaimers)
    const contentRule = this.rules.contentTypeRules[contentType];
    if (contentRule && contentRule.requiresDisclaimer) {
      const hasDisclaimer = contentRule.disclaimerKeywords.some(keyword => 
        lowerText.includes(keyword)
      );
      if (!hasDisclaimer) {
        externalPenalty += contentRule.penalty;
        issues.push({
          area: 'External (compliance)',
          phrase: '',
          penalty: contentRule.penalty,
          severity: contentRule.severity,
          message: contentRule.message,
          suggestion: contentRule.suggestion
        });
      }
    }

    // Calculate scores (0-100 scale)
    const internalScore = Math.max(0, 100 - internalPenalty);
    const externalScore = Math.max(0, 100 - externalPenalty);
    const assetScore = Math.max(0, 100 - assetPenalty);
    const totalScore = Math.round((internalScore + externalScore + assetScore) / 3);

    return {
      scores: {
        internal: internalScore,
        external: externalScore,
        asset: assetScore,
        total: totalScore
      },
      issues: issues,
      penalties: {
        internal: internalPenalty,
        external: externalPenalty,
        asset: assetPenalty
      }
    };
  }

  /**
   * Helper method to check an array of rules against text
   * @private
   */
  _checkRuleArray(rules, text, bucket, currentPenalty, issues, setPenalty) {
    rules.forEach(rule => {
      if (text.includes(rule.phrase)) {
        const penalty = currentPenalty + rule.penalty;
        setPenalty(penalty);
        
        issues.push({
          id: rule.id,
          area: this._getAreaLabel(bucket),
          phrase: rule.phrase,
          penalty: rule.penalty,
          severity: rule.severity,
          message: rule.message,
          suggestion: rule.suggestion || ''
        });
      }
    });
  }

  /**
   * Get human-readable area label
   * @private
   */
  _getAreaLabel(bucket) {
    const labels = {
      internal: 'Internal (tone / technical / BU / legal)',
      external: 'External (market / culture / ESG)',
      asset: 'Asset fit (presentation / image / social)'
    };
    return labels[bucket] || bucket;
  }

  /**
   * Determines approval path based on score and issues
   * @param {number} totalScore - Overall score
   * @param {Array} issues - List of identified issues
   * @returns {Object} Approval recommendation
   */
  determineApprovalPath(totalScore, issues) {
    let approver = 'BU owner / brand';
    let riskLevel = 'green';
    let riskLabel = 'Green – aligned with brand, light review';

    if (totalScore >= 85) {
      riskLevel = 'green';
      riskLabel = 'Green – aligned with brand, light review';
    } else if (totalScore >= 70) {
      riskLevel = 'yellow';
      riskLabel = 'Yellow – partially aligned, 1–2 approvers';
    } else {
      riskLevel = 'red';
      riskLabel = 'Red – misaligned, escalate';
      approver = 'Regulatory / Sustainability / Brand';
    }

    // Determine specific approver based on issue types
    for (const issue of issues) {
      const msg = issue.message.toLowerCase();
      if (msg.includes('regulatory') || msg.includes('legally')) {
        approver = 'Regulatory / legal';
      }
      if (msg.includes('greenwashing') || msg.includes('sustainability')) {
        approver = 'Sustainability lead';
        break;
      }
      if (issue.area.includes('Asset fit')) {
        approver = 'Brand owner';
      }
    }

    return {
      approver,
      riskLevel,
      riskLabel,
      totalScore
    };
  }

  /**
   * Generates suggested rewrite with inline hints
   * @param {string} originalText - Original content
   * @param {Array} issues - List of issues with suggestions
   * @returns {string} Text with inline suggestions
   */
  generateSuggestedRewrite(originalText, issues) {
    let updated = originalText;
    
    issues.forEach(issue => {
      if (issue.phrase) {
        const marker = ` [→ ${issue.suggestion}]`;
        const regex = new RegExp(issue.phrase, 'gi');
        updated = updated.replace(regex, issue.phrase + marker);
      }
    });

    return updated;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RulesEngine;
}
