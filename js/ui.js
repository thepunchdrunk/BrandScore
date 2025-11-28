/**
 * UI Utilities Module
 * Manages UI state, updates, and user interactions.
 * @module ui
 */

/**
 * UI Manager class for handling user interface updates and state
 */
class UIManager {
  /**
   * Creates a new UIManager instance
   */
  constructor() {
    this.elements = {};
    this.speedometer = null;
    this.state = {
      isAnalyzing: false,
      hasAnalysis: false,
      currentContent: ''
    };
  }

  /**
   * Initializes UI elements and event listeners
   * @param {Object} elementIds - Object mapping element names to IDs
   */
  initialize(elementIds) {
    // Cache DOM elements
    Object.keys(elementIds).forEach(key => {
      const id = elementIds[key];
      this.elements[key] = document.getElementById(id);
      if (!this.elements[key]) {
        console.warn(`Element with id "${id}" not found`);
      }
    });

    // Initialize speedometer gauge
    try {
      this.speedometer = new SpeedometerGauge('speedometerContainer', {
        size: 200,
        maxScore: 100,
        animated: true
      });
    } catch (error) {
      console.warn('Speedometer initialization failed:', error);
    }
  }

  /**
   * Updates character count display
   * @param {string} text - Text to count
   */
  updateCharCount(text) {
    if (this.elements.charCount) {
      const count = text.trim().length;
      this.elements.charCount.textContent = `${count} characters`;
    }
    this.state.currentContent = text;
  }

  /**
   * Shows loading state during analysis
   * @param {boolean} isLoading - Whether loading is in progress
   */
  setLoadingState(isLoading) {
    this.state.isAnalyzing = isLoading;
    
    if (this.elements.analyzeButton) {
      this.elements.analyzeButton.disabled = isLoading;
      this.elements.analyzeButton.textContent = isLoading 
        ? 'Analyzing...' 
        : 'Run brand alignment check';
    }

    // Show/hide progress indicator if it exists
    if (this.elements.progressIndicator) {
      this.elements.progressIndicator.style.display = isLoading ? 'block' : 'none';
    }
  }

  /**
   * Displays analysis results in the UI
   * @param {Object} analysis - Complete analysis results
   */
  displayResults(analysis) {
    this.state.hasAnalysis = true;

    // Update scores
    this._updateScores(analysis.scores);

    // Update risk badge
    this._updateRiskBadge(analysis.approval);

    // Update approval text
    this._updateApprovalText(analysis.approval);

    // Display issues
    this._displayIssues(analysis.issues);

    // Display suggested rewrite
    this._displaySuggestedRewrite(analysis.suggestedRewrite);

    // Enable apply suggestions button
    if (this.elements.applySuggestionsButton) {
      this.elements.applySuggestionsButton.disabled = false;
    }
  }

  /**
   * Updates score displays
   * @private
   */
  _updateScores(scores) {
    const scoreElements = {
      internalScore: scores.internal,
      externalScore: scores.external,
      assetScore: scores.asset
    };

    Object.keys(scoreElements).forEach(key => {
      if (this.elements[key]) {
        this.elements[key].textContent = scoreElements[key];
      }
    });

    // Animate speedometer to total score
    if (this.speedometer) {
      this.speedometer.animate(scores.total, 1200);
    }
  }

  /**
   * Updates risk badge display
   * @private
   */
  _updateRiskBadge(approval) {
    if (!this.elements.riskBadge) return;

    const badge = this.elements.riskBadge;
    badge.className = 'inline-block text-[11px] px-2 py-1 rounded-full border font-medium ';

    const styleMap = {
      green: 'border-emerald-500 text-emerald-300 bg-emerald-500/10',
      yellow: 'border-amber-500 text-amber-300 bg-amber-500/10',
      red: 'border-rose-500 text-rose-300 bg-rose-500/10'
    };

    badge.className += styleMap[approval.riskLevel] || styleMap.red;
    badge.textContent = approval.riskLabel;
  }

  /**
   * Updates approval path text
   * @private
   */
  _updateApprovalText(approval) {
    if (!this.elements.approverText) return;

    this.elements.approverText.textContent = 
      `Suggested primary approver: ${approval.approver}. ` +
      `Overall brand alignment: ${approval.totalScore} (internal / external / asset).`;
  }

  /**
   * Displays issues list
   * @private
   */
  _displayIssues(issues) {
    if (!this.elements.issuesContainer) return;

    const container = this.elements.issuesContainer;
    container.innerHTML = '';

    if (issues.length === 0) {
      container.innerHTML = `
        <p class='text-slate-500 text-xs'>
          No issues matched this simple rule set. Human review is still required, 
          but nothing was flagged by the brand engine.
        </p>
      `;
      return;
    }

    issues.forEach(issue => {
      const issueEl = this._createIssueElement(issue);
      container.appendChild(issueEl);
    });
  }

  /**
   * Creates an issue element
   * @private
   */
  _createIssueElement(issue) {
    const div = document.createElement('div');
    div.className = 'border border-slate-800 rounded-lg p-2 bg-slate-950/70';

    const severityBadge = this._getSeverityBadge(issue.severity);
    const phraseHtml = issue.phrase 
      ? `<p class='text-[11px] text-slate-400 mb-0.5'>
           <span class='text-slate-300'>Matched phrase:</span> "${issue.phrase}"
         </p>`
      : '';

    div.innerHTML = `
      <div class="flex items-center justify-between mb-1">
        <p class='text-[11px] text-slate-400 mb-0'>
          <span class='text-slate-300'>Area:</span> ${issue.area}
        </p>
        ${severityBadge}
      </div>
      ${phraseHtml}
      <p class='text-[11px] text-slate-400 mb-0.5'>
        <span class='text-slate-300'>Impact:</span> -${issue.penalty} points
      </p>
      <p class='text-[11px] text-slate-400'>
        <span class='text-slate-300'>Reason:</span> ${issue.message}<br/>
        <span class='text-slate-300'>Suggestion:</span> ${issue.suggestion}
      </p>
    `;

    return div;
  }

  /**
   * Gets severity badge HTML
   * @private
   */
  _getSeverityBadge(severity) {
    const badges = {
      critical: '<span class="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/50">Critical</span>',
      warning: '<span class="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/50">Warning</span>',
      info: '<span class="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/50">Info</span>'
    };
    return badges[severity] || '';
  }

  /**
   * Displays suggested rewrite
   * @private
   */
  _displaySuggestedRewrite(rewrite) {
    if (!this.elements.suggestedContainer) return;
    this.elements.suggestedContainer.textContent = rewrite;
  }

  /**
   * Updates file status display
   * @param {Object} metadata - File metadata
   */
  updateFileStatus(metadata) {
    if (this.elements.fileStatus) {
      this.elements.fileStatus.textContent = `Selected: ${metadata.name}`;
    }

    if (this.elements.fileMeta) {
      this.elements.fileMeta.textContent = 
        `Type: ${metadata.extension} • Size: ${metadata.sizeKb} kB`;
    }
  }

  /**
   * Shows error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    // Create or update error notification
    let errorEl = document.getElementById('errorNotification');
    
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.id = 'errorNotification';
      errorEl.className = 'fixed top-4 right-4 bg-rose-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-md';
      document.body.appendChild(errorEl);
    }

    errorEl.innerHTML = `
      <div class="flex items-start gap-2">
        <span class="text-lg">⚠️</span>
        <div class="flex-1">
          <p class="font-semibold text-sm">Error</p>
          <p class="text-xs">${message}</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-rose-200">
          ✕
        </button>
      </div>
    `;

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorEl && errorEl.parentElement) {
        errorEl.remove();
      }
    }, 5000);
  }

  /**
   * Shows success message
   * @param {string} message - Success message to display
   */
  showSuccess(message) {
    const successEl = document.createElement('div');
    successEl.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-md';
    
    successEl.innerHTML = `
      <div class="flex items-start gap-2">
        <span class="text-lg">✓</span>
        <div class="flex-1">
          <p class="text-sm">${message}</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-emerald-200">
          ✕
        </button>
      </div>
    `;

    document.body.appendChild(successEl);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (successEl && successEl.parentElement) {
        successEl.remove();
      }
    }, 3000);
  }

  /**
   * Shows info message
   * @param {string} message - Info message to display
   */
  showInfo(message) {
    const infoEl = document.createElement('div');
    infoEl.className = 'fixed top-4 right-4 bg-cyan-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-md';
    
    infoEl.innerHTML = `
      <div class="flex items-start gap-2">
        <span class="text-lg">ℹ️</span>
        <div class="flex-1">
          <p class="text-sm">${message}</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-cyan-200">
          ✕
        </button>
      </div>
    `;

    document.body.appendChild(infoEl);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (infoEl && infoEl.parentElement) {
        infoEl.remove();
      }
    }, 3000);
  }

  /**
   * Gets current UI state
   * @returns {Object} Current state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Resets UI to initial state
   */
  reset() {
    this.state = {
      isAnalyzing: false,
      hasAnalysis: false,
      currentContent: ''
    };

    // Reset scores
    ['internalScore', 'externalScore', 'assetScore'].forEach(key => {
      if (this.elements[key]) {
        this.elements[key].textContent = '—';
      }
    });

    // Reset speedometer
    if (this.speedometer) {
      this.speedometer.setScore(0);
    }

    // Reset risk badge
    if (this.elements.riskBadge) {
      this.elements.riskBadge.className = 'inline-block text-[11px] px-2 py-1 rounded-full border border-slate-700 text-slate-400';
      this.elements.riskBadge.textContent = 'Not analyzed';
    }

    // Reset approver text
    if (this.elements.approverText) {
      this.elements.approverText.textContent = 
        'Run an analysis to see whether BU, regulatory, sustainability or brand needs to review.';
    }

    // Clear issues
    if (this.elements.issuesContainer) {
      this.elements.issuesContainer.innerHTML = `
        <p class="text-slate-500 text-xs">
          No analysis yet. Upload or paste content and click
          <span class="text-cyan-400">Run brand alignment check</span>.
        </p>
      `;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIManager;
}
