# Brand Alignment Studio

**Professional Edition** - An intelligent brand compliance analysis tool for checking alignment of assets (emails, slides, docs, images) against brand guidelines for a Danish B2B industrial machinery company.

## Overview

The Brand Alignment Studio helps ensure that internal and external communications align with brand guidelines, tone of voice, legal requirements, and cultural sensitivities across different markets and business units. Now with an enhanced modern UI and offline functionality.

## Features

### Core Functionality
- **Multi-format File Upload**: Drag-and-drop or browse to upload various file types (PDF, Office documents, images, text files)
- **Brand Rule Evaluation**: Comprehensive rule-based checking against brand tone, legal claims, sustainability messaging, and technical accuracy
- **Multi-dimensional Scoring**: Separate scores for internal brand fit, external/cultural fit, and asset-type fit
- **Contextual Analysis**: Takes into account business unit, target country, asset type, and content intent
- **Approval Path Recommendations**: Suggests appropriate reviewers based on detected issues
- **Inline Suggestions**: Provides actionable rewrite suggestions directly in the text
- **Offline Capability**: Works without a web server using embedded rules data

### User Experience
- **Modern UI Design**: Professional gradient-based design with improved visual hierarchy
- **Enhanced Icons**: SVG icons throughout the interface for better visual feedback
- **Real-time Character Counting**: Tracks content length as you type
- **Session Persistence**: Automatically saves your work to browser localStorage
- **Export Functionality**: Download analysis results as JSON
- **Sample Content**: Load pre-configured examples to test the system
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + Enter` - Run analysis
  - `Ctrl/Cmd + S` - Export results
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Advanced Features
- **Configurable Rules**: JSON-based rule system that can be updated without code changes
- **Embedded Rules**: Rules data included in JavaScript for offline functionality
- **Severity Levels**: Issues categorized as critical, warning, or info
- **Analysis History**: Keeps track of up to 50 previous analyses
- **Modern Dark Theme**: Professional gradient background with glass morphism effects

## Architecture

The application follows a modular architecture with clear separation of concerns:

```
Pod-3/
├── index.html              # Main HTML structure with enhanced UI
├── styles.css              # Enhanced custom CSS styles
├── data/
│   └── rules.json         # Configurable brand rules (JSON format)
└── js/
    ├── rulesData.js       # Embedded rules for offline functionality
    ├── app.js             # Main application controller
    ├── analyzer.js        # Analysis engine
    ├── rulesEngine.js     # Rule evaluation logic
    ├── fileProcessor.js   # File upload and parsing
    └── ui.js              # UI utilities and state management
```

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- **Optional**: A local web server (recommended for development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DanfossProd/Pod-3.git
cd Pod-3
```

2. **Option A: Direct File Access (Recommended for quick testing)**
   - Simply open `index.html` in your browser
   - The application now works offline with embedded rules data

3. **Option B: Local Web Server (For development)**

**Using Python:**
```bash
python -m http.server 8000
```

**Using Node.js (http-server):**
```bash
npx http-server -p 8000
```

**Using PHP:**
```bash
php -S localhost:8000
```

Then open your browser and navigate to:
```
http://localhost:8000
```

### Usage

1. **Select Context**:
   - Choose the business unit (Hydraulics, Automation, Pumping, Sensors)
   - Select the target country (Denmark, Germany, India, United States)
   - Pick the asset type (Email, Slide, Document, Image, Social)
   - Specify the content intent (Internal, Customer proposal, Datasheet, ESG report)

2. **Add Content**:
   - Drag and drop a file into the upload zone, or
   - Click to browse and select a file, or
   - Paste or type content directly into the text area, or
   - Click "Load synthetic internal sample" to test with example content

3. **Run Analysis**:
   - Click "Run brand alignment check" or press `Ctrl/Cmd + Enter`
   - Review the scores (internal, external, asset, and overall)
   - Check the risk badge (green, yellow, or red)
   - Read through the detailed issues and suggestions

4. **Apply Suggestions**:
   - Review the suggested rewrite with inline hints
   - Click "Apply hint-marked text" to copy suggestions to the main content area
   - Make manual adjustments as needed

5. **Export Results**:
   - Click "Export Results" or press `Ctrl/Cmd + S`
   - Save the JSON file for your records or further analysis

## Rules Configuration

The brand rules are defined in `data/rules.json`. This file contains:

- **Brand Tone Rules**: Checks for vague superlatives and hype language
- **Legal Claims**: Validates safety and emission claims
- **Sustainability**: Ensures eco-friendly messaging has proper backing
- **Technical**: Verifies technical specifications are precise
- **Cultural**: Country-specific sensitivities
- **Business Units**: Domain-specific terminology requirements
- **Asset Types**: Format-specific guidelines
- **Content Type Rules**: Context-appropriate disclaimers

### Rule Structure

Each rule includes:
```json
{
  "id": "unique-rule-id",
  "phrase": "text to match",
  "penalty": 10,
  "severity": "warning",
  "message": "Why this is flagged",
  "suggestion": "How to fix it"
}
```

### Customizing Rules

To add or modify rules:

1. Open `data/rules.json`
2. Edit the relevant section (brandTone, legalClaims, sustainability, etc.)
3. Follow the existing structure
4. Save the file
5. Refresh the application

No code changes are required to update rules!

## Module Documentation

### RulesEngine (`js/rulesEngine.js`)
Manages and evaluates brand alignment rules against content.

**Key Methods:**
- `loadRules(source)` - Loads rules from JSON file or object
- `evaluate(params)` - Evaluates content against all applicable rules
- `determineApprovalPath(totalScore, issues)` - Determines approval requirements
- `generateSuggestedRewrite(originalText, issues)` - Creates text with inline hints

### Analyzer (`js/analyzer.js`)
Core analysis engine that coordinates rule evaluation and result processing.

**Key Methods:**
- `analyze(params)` - Performs complete brand alignment analysis
- `getLastAnalysis()` - Retrieves the most recent analysis
- `getHistory()` - Returns analysis history
- `exportToJSON(analysis)` - Exports analysis as JSON string
- `downloadJSON(analysis, filename)` - Downloads analysis as file
- `compareAnalyses(analysis1, analysis2)` - Compares two analyses

### FileProcessor (`js/fileProcessor.js`)
Handles file upload, drag-and-drop, and content extraction.

**Key Methods:**
- `initialize(dropZone, fileInput)` - Sets up file handling
- `handleFile(file)` - Processes uploaded file
- `getCurrentFile()` - Gets current file metadata
- `clear()` - Clears current file

### UIManager (`js/ui.js`)
Manages UI state, updates, and user interactions.

**Key Methods:**
- `initialize(elementIds)` - Caches DOM elements
- `updateCharCount(text)` - Updates character counter
- `setLoadingState(isLoading)` - Shows/hides loading state
- `displayResults(analysis)` - Renders analysis results
- `updateFileStatus(metadata)` - Updates file info display
- `showError(message)` - Displays error notification
- `showSuccess(message)` - Displays success notification
- `reset()` - Resets UI to initial state

### BrandAlignmentApp (`js/app.js`)
Main application controller that coordinates all modules.

**Key Methods:**
- `initialize()` - Initializes the application
- `runAnalysis()` - Executes brand alignment check
- `applySuggestions()` - Applies suggested rewrite
- `loadSample()` - Loads sample content
- `exportResults()` - Exports analysis results

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with responsive design

## Performance Considerations

- Rules are loaded once at startup and cached
- Analysis is performed client-side for instant results
- Session data is stored in localStorage (up to ~5MB)
- Analysis history is limited to 50 entries

## Security

- All processing happens client-side (no data sent to external servers)
- File content is read but never uploaded
- LocalStorage is used only for session persistence
- No sensitive data is logged or stored

## Accessibility

The application follows WCAG 2.1 guidelines:
- Semantic HTML structure
- ARIA labels and live regions
- Keyboard navigation support
- Focus indicators
- High contrast support
- Reduced motion support
- Screen reader compatible

## Future Enhancements

Potential improvements for future versions:

- [ ] Backend integration for advanced file parsing
- [ ] PDF export of analysis reports
- [ ] Real-time collaboration features
- [ ] Custom rule creation UI
- [ ] Batch analysis mode
- [ ] Dark/light theme toggle
- [ ] Multiple language support
- [ ] Machine learning-based pattern detection
- [ ] Integration with document management systems
- [ ] Detailed analytics dashboard

## Contributing

This is an internal demo tool. For questions or suggestions, please contact the internal communications team.

## License

Internal use only. All rights reserved.

## Version History

### Version 2.0.0 (2025-11-25)
- Complete refactoring with modular architecture
- Separated concerns into distinct modules
- Added configurable JSON-based rules
- Enhanced accessibility features
- Added keyboard shortcuts
- Improved error handling
- Added export functionality
- Session persistence
- Better mobile responsiveness

### Version 1.0.0
- Initial single-file implementation
- Basic rule checking
- File upload support
- Score calculation
- Inline suggestions

## Support

For technical support or feature requests, please contact:
- Internal IT Support: support@example.com
- Brand Team: brand@example.com

---

**Note**: This tool provides automated suggestions but does not replace human review. All content should be reviewed by appropriate stakeholders before publication.
