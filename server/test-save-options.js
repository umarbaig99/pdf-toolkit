const { PDFDocument } = require('pdf-lib');

async function test() {
    try {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        page.drawText('Test');

        console.log('Attempting to save with encryption options...');
        const pdfBytes = await pdfDoc.save({
            userPassword: '123',
            ownerPassword: '123',
            permissions: {
                printing: 'highResolution',
                modifying: false,
                copying: false,
                annotating: false,
                fillingForms: false,
                contentAccessibility: false,
                documentAssembly: false,
            },
        });
        console.log('Success!');
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
