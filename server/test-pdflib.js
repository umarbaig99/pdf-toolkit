const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function test() {
    try {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        page.drawText('Test');

        // Current implementation in controller
        const pdfBytes = await pdfDoc.save({
            userPassword: '123',
            ownerPassword: '123'
        });

        fs.writeFileSync('test-output.pdf', pdfBytes);
        console.log('Saved with save options');

        // Correct implementation hypothesis
        const pdfDoc2 = await PDFDocument.create();
        pdfDoc2.addPage().drawText('Test 2');
        await pdfDoc2.encrypt({ userPassword: '123', ownerPassword: '123' });
        const pdfBytes2 = await pdfDoc2.save();
        fs.writeFileSync('test-output-2.pdf', pdfBytes2);
        console.log('Saved with encrypt() method');

    } catch (e) {
        console.error(e);
    }
}

test();
