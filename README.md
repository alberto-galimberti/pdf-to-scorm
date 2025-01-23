# PDF Viewer SCORM Package Generator

This project is a Chrome extension and SCORM package generator that allows users to:

1. Upload and view PDF files using a customized PDF viewer built with PDF.js.
2. Navigate through the PDF with "Next" and "Previous" buttons.
3. Track user interactions such as page changes and completion for SCORM compatibility.
4. Package the uploaded PDF and viewer as a SCORM-compliant ZIP file for use in Learning Management Systems (LMS) such as Docebo.

## Features

- **PDF Viewing:** A single-page viewer that renders PDFs dynamically.
- **SCORM Tracking:** Logs events such as file opened, page navigation, and completion, optimized for SCORM 1.2 and SCORM 2004.
- **SCORM Package Generation:** Bundles the viewer and uploaded PDF into a SCORM-compliant ZIP file.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/pdf-viewer-scorm.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode".
4. Click "Load unpacked" and select the project directory.

## Usage

1. Click on the extension icon in the browser toolbar.
2. Upload a PDF file.
3. Use the "Next" and "Previous" buttons to navigate through the PDF.
4. Click the "Generate SCORM" button (if available) to download the SCORM package.

## File Structure

- `manifest.json`: Chrome extension manifest file.
- `popup.html`: HTML file for the extension UI.
- `popup.js`: JavaScript for handling PDF uploads, rendering, and SCORM tracking.
- `renderer.js`: JavaScript file for PDF rendering and navigation logic.
- `viewer.css`: Optional styling for the PDF viewer.

## Dependencies

- [PDF.js](https://mozilla.github.io/pdf.js/): Used for rendering PDF documents.
- [JSZip](https://stuk.github.io/jszip/): Used for generating the SCORM package.

## SCORM Compatibility

The generated SCORM package includes:

- `imsmanifest.xml`: Defines the SCORM package structure.
- Uploaded PDF file.
- PDF viewer files (`renderer.js`, `viewer.css`, etc.).

Tested on SCORM 1.2 and SCORM 2004-compliant LMS platforms.

## Contribution

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the GNU-GPL 3 License. See the LICENSE file for details.

## Acknowledgments

- Mozilla PDF.js Team
- JSZip Contributors
