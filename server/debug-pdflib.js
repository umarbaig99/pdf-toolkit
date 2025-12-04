const { PDFDocument } = require('pdf-lib');

async function debug() {
    const pdfDoc = await PDFDocument.create();
    console.log('Methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(pdfDoc)));
    console.log('Encrypt present:', typeof pdfDoc.encrypt);
}

debug();
