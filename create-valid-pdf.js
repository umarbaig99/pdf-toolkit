const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function createValidPdf() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    page.drawText('This is a valid PDF');
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('valid.pdf', pdfBytes);
    console.log('Created valid.pdf');
}

createValidPdf();
