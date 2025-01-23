document.getElementById('fileInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const fileReader = new FileReader();
        fileReader.onload = function () {
            const pdfData = new Uint8Array(this.result);
            storePDF(file.name, pdfData);
        };
        fileReader.readAsArrayBuffer(file);
    }
});

function storePDF(fileName, pdfData) {
    // Store the uploaded PDF data in the extension's storage for later packaging
    chrome.storage.local.set({ pdfFile: { fileName, data: Array.from(pdfData) } });
    document.getElementById('message-output').textContent = `File ${fileName} uploaded successfully!`;
}
