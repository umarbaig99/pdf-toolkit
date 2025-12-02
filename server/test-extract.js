const fs = require('fs');
const pdfParse = require('pdf-parse');

const testFile = 'multipage.pdf';

async function test() {
    try {
        const dataBuffer = fs.readFileSync(testFile);
        const data = await pdfParse(dataBuffer);
        console.log('Text:', data.text.substring(0, 100)); // Print first 100 chars
        console.log('Pages:', data.numpages);
    } catch (err) {
        console.error('Error:', err);
    }
}

test();
