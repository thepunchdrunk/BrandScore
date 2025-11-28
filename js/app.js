/**
 * Brand Alignment Studio - Main Application Controller
 * Coordinates all modules and manages application lifecycle.
 * @module app
 */

/**
 * Main Application class
 */
class BrandAlignmentApp {
  /**
   * Creates a new BrandAlignmentApp instance
   */
  constructor() {
    this.rulesEngine = null;
    this.analyzer = null;
    this.fileProcessor = null;
    this.uiManager = null;
    this.isInitialized = false;
  }

  /**
   * Initializes the application
   */
  async initialize() {
    try {
      console.log('Initializing Brand Alignment Studio...');

      // Initialize Rules Engine
      this.rulesEngine = new RulesEngine();
      
      // Try to load rules from embedded data first (works offline), 
      // fallback to fetch if needed (when served via web server)
      try {
        if (typeof BRAND_RULES !== 'undefined') {
          // Use embedded rules data
          await this.rulesEngine.loadRules(BRAND_RULES);
        } else {
          // Fallback to fetching from file
          await this.rulesEngine.loadRules('data/rules.json');
        }
      } catch (rulesError) {
        console.error('Failed to load rules:', rulesError);
        throw new Error('Unable to load brand rules. Please ensure the application files are complete.');
      }

      // Initialize Analyzer
      this.analyzer = new Analyzer(this.rulesEngine);

      // Initialize UI Manager
      this.uiManager = new UIManager();
      this._initializeUIElements();

      // Initialize File Processor
      this.fileProcessor = new FileProcessor({
        onFileLoaded: (metadata) => this._handleFileLoaded(metadata),
        onContentExtracted: (content, metadata) => this._handleContentExtracted(content, metadata),
        onError: (error) => this.uiManager.showError(`File processing error: ${error.message}`)
      });

      // Set up file processor
      const dropZone = document.getElementById('dropZone');
      const fileInput = document.getElementById('fileInput');
      this.fileProcessor.initialize(dropZone, fileInput);

      // Set up event listeners
      this._setupEventListeners();

      // Load sample data
      this._setupSampleData();

      // Try to restore last session from localStorage
      this._restoreSession();

      this.isInitialized = true;
      console.log('Application initialized successfully');

    } catch (error) {
      console.error('Failed to initialize application:', error);
      if (this.uiManager) {
        this.uiManager.showError('Failed to initialize application. Please refresh the page.');
      } else {
        alert('Failed to initialize application: ' + error.message);
      }
    }
  }

  /**
   * Initializes UI element references
   * @private
   */
  _initializeUIElements() {
    this.uiManager.initialize({
      content: 'content',
      charCount: 'charCount',
      analyzeButton: 'analyze',
      applySuggestionsButton: 'applySuggestions',
      internalScore: 'internalScore',
      externalScore: 'externalScore',
      assetScore: 'assetScore',
      totalScore: 'totalScore',
      riskBadge: 'riskBadge',
      approverText: 'approverText',
      issuesContainer: 'issues',
      suggestedContainer: 'suggested',
      fileStatus: 'fileStatus',
      fileMeta: 'fileMeta'
    });
  }

  /**
   * Sets up event listeners
   * @private
   */
  _setupEventListeners() {
    // Content textarea change
    const contentEl = this.uiManager.elements.content;
    if (contentEl) {
      contentEl.addEventListener('input', () => {
        this.uiManager.updateCharCount(contentEl.value);
        this._saveSession();
      });
    }

    // Analyze button
    const analyzeBtn = this.uiManager.elements.analyzeButton;
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => this.runAnalysis());
    }

    // Apply suggestions button
    const applySuggestionsBtn = this.uiManager.elements.applySuggestionsButton;
    if (applySuggestionsBtn) {
      applySuggestionsBtn.addEventListener('click', () => this.applySuggestions());
    }

    // Load sample button
    const loadSampleBtn = document.getElementById('loadSample');
    if (loadSampleBtn) {
      loadSampleBtn.addEventListener('click', () => this.loadSample());
    }

    // Export button (if it exists)
    const exportBtn = document.getElementById('exportResults');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportResults());
    }

    // Keyboard shortcuts
    this._setupKeyboardShortcuts();
  }

  /**
   * Sets up keyboard shortcuts
   * @private
   */
  _setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Enter to analyze
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.runAnalysis();
      }

      // Ctrl/Cmd + S to save/export
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.exportResults();
      }
    });
  }

  /**
   * Handles file loaded event
   * @private
   */
  _handleFileLoaded(metadata) {
    this.uiManager.updateFileStatus(metadata);

    // Auto-update form fields based on inferred data
    if (metadata.inferredAssetType) {
      const assetTypeEl = document.getElementById('assetType');
      if (assetTypeEl) {
        assetTypeEl.value = metadata.inferredAssetType;
      }
    }

    if (metadata.inferredContentType) {
      const contentTypeEl = document.getElementById('contentType');
      if (contentTypeEl) {
        contentTypeEl.value = metadata.inferredContentType;
      }
    }
  }

  /**
   * Handles content extracted event
   * @private
   */
  _handleContentExtracted(content, metadata) {
    const contentEl = this.uiManager.elements.content;
    if (contentEl) {
      contentEl.value = content;
      this.uiManager.updateCharCount(content);
    }
    this._saveSession();
  }

  /**
   * Runs brand alignment analysis
   */
  async runAnalysis() {
    try {
      const contentEl = this.uiManager.elements.content;
      const content = contentEl ? contentEl.value : '';

      if (!content.trim()) {
        this.uiManager.showError('Please enter or upload content to analyze');
        return;
      }

      // Show loading state
      this.uiManager.setLoadingState(true);

      // Get form values
      const businessUnit = document.getElementById('bu')?.value || 'hydraulics';
      const country = document.getElementById('country')?.value || 'DK';
      const assetType = document.getElementById('assetType')?.value || 'email';
      const contentType = document.getElementById('contentType')?.value || 'internal';

      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));

      // Perform analysis
      const analysis = this.analyzer.analyze({
        content,
        businessUnit,
        country,
        assetType,
        contentType
      });

      // Display results
      this.uiManager.displayResults(analysis);

      // Save to session
      this._saveSession();

      // Show success message
      const issueCount = analysis.issues.length;
      const scoreText = analysis.scores.total;
      this.uiManager.showSuccess(
        `Analysis complete! Score: ${scoreText}/100, ${issueCount} issue(s) found.`
      );

    } catch (error) {
      console.error('Analysis error:', error);
      this.uiManager.showError(`Analysis failed: ${error.message}`);
    } finally {
      this.uiManager.setLoadingState(false);
    }
  }

  /**
   * Applies suggested rewrite to content textarea
   */
  applySuggestions() {
    const suggestedEl = this.uiManager.elements.suggestedContainer;
    const contentEl = this.uiManager.elements.content;

    if (suggestedEl && contentEl) {
      const suggestedText = suggestedEl.textContent;
      if (suggestedText.trim()) {
        contentEl.value = suggestedText;
        this.uiManager.updateCharCount(suggestedText);
        this.uiManager.showInfo('Suggestions applied to content');
        this._saveSession();
      }
    }
  }

  /**
   * Loads a sample text
   */
  loadSample() {
    const samples = [
      "Email (Hydraulics, DE): We present a world-class climate neutral motor upgrade as a green solution with zero emissions for your plant. Around 10 kW per pump is expected. This deck is customer-facing.",
      "Slide notes (Automation, DK): Headline: GAME-CHANGING IIoT GATEWAY. Tiny logo in corner, all caps headline. Copy: super cheap, eco-friendly upgrade for legacy lines, click here now to learn more.",
      "ESG paragraph (Pumping, IN): Thanks to cheap labour in India we can offer a super cheap upgrade path, positioned as a green solution without detailed lifecycle data. Figures are subject to change.",
      "Image description (Sensors, US): Hero image shows a smokestack and coal plant with heavy pollution, with a tiny logo in the corner. Caption uses click here now CTA about condition monitoring."
    ];

    const idx = Math.floor(Math.random() * samples.length);
    const contentEl = this.uiManager.elements.content;
    
    if (contentEl) {
      contentEl.value = samples[idx];
      this.uiManager.updateCharCount(samples[idx]);
      this.uiManager.showInfo('Sample content loaded');
      this._saveSession();
    }
  }

  /**
   * Sets up sample data
   * @private
   */
  _setupSampleData() {
    // Initial character count
    const contentEl = this.uiManager.elements.content;
    if (contentEl) {
      this.uiManager.updateCharCount(contentEl.value);
    }
  }

  /**
   * Exports analysis results
   */
  exportResults() {
    const lastAnalysis = this.analyzer.getLastAnalysis();
    
    if (!lastAnalysis) {
      this.uiManager.showError('No analysis to export. Run an analysis first.');
      return;
    }

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `brand-analysis-${timestamp}.json`;
      this.analyzer.downloadJSON(lastAnalysis, filename);
      this.uiManager.showSuccess('Analysis exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      this.uiManager.showError(`Export failed: ${error.message}`);
    }
  }

  /**
   * Saves current session to localStorage
   * @private
   */
  _saveSession() {
    try {
      const contentEl = this.uiManager.elements.content;
      const session = {
        content: contentEl ? contentEl.value : '',
        businessUnit: document.getElementById('bu')?.value,
        country: document.getElementById('country')?.value,
        assetType: document.getElementById('assetType')?.value,
        contentType: document.getElementById('contentType')?.value,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('brandAlignmentSession', JSON.stringify(session));
    } catch (error) {
      console.warn('Failed to save session:', error);
    }
  }

  /**
   * Restores previous session from localStorage
   * @private
   */
  _restoreSession() {
    try {
      const sessionData = localStorage.getItem('brandAlignmentSession');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        
        // Restore content if less than 24 hours old
        const sessionAge = Date.now() - new Date(session.timestamp).getTime();
        if (sessionAge < 24 * 60 * 60 * 1000) {
          const contentEl = this.uiManager.elements.content;
          if (contentEl && session.content) {
            contentEl.value = session.content;
            this.uiManager.updateCharCount(session.content);
          }

          // Restore form values
          if (session.businessUnit) {
            const buEl = document.getElementById('bu');
            if (buEl) buEl.value = session.businessUnit;
          }
          if (session.country) {
            const countryEl = document.getElementById('country');
            if (countryEl) countryEl.value = session.country;
          }
          if (session.assetType) {
            const assetEl = document.getElementById('assetType');
            if (assetEl) assetEl.value = session.assetType;
          }
          if (session.contentType) {
            const contentTypeEl = document.getElementById('contentType');
            if (contentTypeEl) contentTypeEl.value = session.contentType;
          }
        }
      }
    } catch (error) {
      console.warn('Failed to restore session:', error);
    }
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const app = new BrandAlignmentApp();
  await app.initialize();

  // Make app globally accessible for debugging
  window.brandAlignmentApp = app;
});
