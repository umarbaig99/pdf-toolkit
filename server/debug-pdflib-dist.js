const { PDFDocument } = require('pdf-lib/dist/pdf-lib.js');

async function debug() {
    try {
        const pdfDoc = await PDFDocument.create();
        console.log('Encrypt present:', typeof pdfDoc.encrypt);
    } catch (e) {
        console.error(e);
    }
}

debug();
