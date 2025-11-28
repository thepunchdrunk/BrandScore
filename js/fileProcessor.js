/**
 * File Processor Module
 * Handles file upload, drag-and-drop, and content extraction.
 * @module fileProcessor
 */

/**
 * FileProcessor class for handling file operations
 */
class FileProcessor {
  /**
   * Creates a new FileProcessor instance
   * @param {Object} callbacks - Callback functions for various events
   * @param {Function} callbacks.onFileLoaded - Called when file is loaded
   * @param {Function} callbacks.onContentExtracted - Called when content is extracted
   * @param {Function} callbacks.onError - Called on error
   */
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    this.currentFile = null;
  }

  /**
   * Initializes file upload and drag-and-drop handlers
   * @param {HTMLElement} dropZone - Drop zone element
   * @param {HTMLInputElement} fileInput - File input element
   */
  initialize(dropZone, fileInput) {
    if (!dropZone || !fileInput) {
      throw new Error('Drop zone and file input elements are required');
    }

    // Click on drop zone opens file dialog
    dropZone.addEventListener('click', () => {
      fileInput.click();
    });

    // Drag and drop handlers
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('border-cyan-400');
    });

    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-cyan-400');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-cyan-400');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        this.handleFile(e.dataTransfer.files[0]);
      }
    });

    // File input change handler
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.handleFile(e.target.files[0]);
      }
    });
  }

  /**
   * Handles file processing
   * @param {File} file - File object to process
   */
  handleFile(file) {
    this.currentFile = file;
    
    const ext = this._getFileExtension(file.name);
    const sizeKb = Math.round(file.size / 1024);
    
    // Extract metadata
    const metadata = {
      name: file.name,
      extension: ext,
      size: file.size,
      sizeKb: sizeKb,
      type: file.type
    };

    // Infer asset type and content type
    metadata.inferredAssetType = this._inferAssetType(ext);
    metadata.inferredContentType = this._inferContentType(file.name);

    // Notify file loaded
    if (this.callbacks.onFileLoaded) {
      this.callbacks.onFileLoaded(metadata);
    }

    // Extract content
    this._extractContent(file, ext, metadata);
  }

  /**
   * Extracts content from file
   * @private
   */
  _extractContent(file, ext, metadata) {
    const reader = new FileReader();
    
    reader.onload = (evt) => {
      let content = evt.target.result || '';
      
      // For binary-ish formats, provide a preview note
      const binaryFormats = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif'];
      if (binaryFormats.includes(ext)) {
        const preview = `// Extracted raw text preview from ${file.name}\n` + 
                       content.slice(0, 4000);
        content = preview;
      }

      if (this.callbacks.onContentExtracted) {
        this.callbacks.onContentExtracted(content, metadata);
      }
    };

    reader.onerror = (error) => {
      if (this.callbacks.onError) {
        this.callbacks.onError(error);
      }
    };

    // Read file as text (demo-level extraction)
    reader.readAsText(file);
  }

  /**
   * Gets file extension from filename
   * @private
   */
  _getFileExtension(filename) {
    return (filename.split('.').pop() || '').toLowerCase();
  }

  /**
   * Infers asset type from file extension
   * @private
   */
  _inferAssetType(ext) {
    const mappings = {
      ppt: 'slide',
      pptx: 'slide',
      pdf: 'doc',
      doc: 'doc',
      docx: 'doc',
      jpg: 'image',
      jpeg: 'image',
      png: 'image',
      gif: 'image'
    };
    return mappings[ext] || null;
  }

  /**
   * Infers content type from filename
   * @private
   */
  _inferContentType(filename) {
    const lower = filename.toLowerCase();
    
    if (lower.includes('esg') || lower.includes('sustain')) {
      return 'esg-report';
    }
    if (lower.includes('proposal') || lower.includes('offer') || lower.includes('quote')) {
      return 'customer-proposal';
    }
    if (lower.includes('datasheet') || lower.includes('spec')) {
      return 'datasheet';
    }
    
    return 'internal';
  }

  /**
   * Gets current file information
   * @returns {Object|null} Current file metadata or null
   */
  getCurrentFile() {
    return this.currentFile;
  }

  /**
   * Clears current file
   */
  clear() {
    this.currentFile = null;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FileProcessor;
}
