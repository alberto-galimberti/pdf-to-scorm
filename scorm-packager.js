document.getElementById('scorm-packager').addEventListener('click', createSCORMZip);

async function getFileContent(filePath) {
    try {
        const response = await fetch(chrome.runtime.getURL(filePath));
        const content = await response.text();

        return content;
    } catch (error) {
        console.error(error, 'Errore nel caricamento del file HTML:', filePath);
    }
}

async function createSCORMZip() {
    await import(chrome.runtime.getURL('./node_modules/jszip/dist/jszip.min.js'));

    const zip = new JSZip();

    // First of all, recover the pdfFile from local storage
    const result = await chrome.storage.local.get(['pdfFile']);
    if (!result.pdfFile) {
        alert('No PDF file uploaded. Please upload a file first.');
        return;
    }
    
    const { data } = result.pdfFile;
    zip.file('document.pdf', new Uint8Array(data));

    // Secondly, Add SCORM manifest
    const manifest = `<?xml version="1.0" encoding="UTF-8"?>
    <manifest identifier="com.example.pdfviewer" version="1.0"
              xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
              xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 ims_xml.xsd">
      <metadata>
        <schema>ADL SCORM</schema>
        <schemaversion>1.2</schemaversion>
      </metadata>
      <organizations>
        <organization identifier="org1">
          <title>Document Training Material</title>
          <item identifier="item1" identifierref="resource1">
            <title>Document Training Material</title>
          </item>
        </organization>
      </organizations>
      <resources>
        <resource identifier="resource1" type="webcontent" adlcp:scormtype="sco" href="renderer.html">
          <file href="renderer.html" />
          <file href="renderer.js" />
          <file href="pdf.js" />
          <file href="pdf_viewer.js" />
          <file href="pdf.worker.js" />
        </resource>
      </resources>
    </manifest>`;
  
    zip.file('imsmanifest.xml', manifest);
  
    // Then, Add renderer files
    zip.file('pdf.js', await getFileContent('node_modules/pdfjs-dist/build/pdf.mjs'));
    zip.file('pdf_viewer.js', await getFileContent('node_modules/pdfjs-dist/web/pdf_viewer.mjs'));
    zip.file('pdf_viewer.css', await getFileContent('node_modules/pdfjs-dist/web/pdf_viewer.css'));
    zip.file('pdf.worker.js', await getFileContent('node_modules/pdfjs-dist/build/pdf.worker.mjs'));

    zip.file('renderer.html', await getFileContent('renderer.html'));
    zip.file('renderer.js', await getFileContent('renderer.js'));
    zip.file('style.css', await getFileContent('style.css'));
    
    
    
  
    // Generate zip
    zip.generateAsync({ type: 'blob' }).then(function(content) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'scorm_package.zip';
      link.click();
    });
  }