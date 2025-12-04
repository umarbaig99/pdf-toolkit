const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function test() {
    try {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        page.drawText('Test');

        // Correct implementation
        await pdfDoc.encrypt({
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

        const pdfBytes = await pdfDoc.save();

        fs.writeFileSync('test-output-fixed.pdf', pdfBytes);
        console.log('Saved with encrypt() method successfully');

    } catch (e) {
        console.error(e);
    }
}

test();
