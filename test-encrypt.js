const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testEncrypt() {
    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(path.join(__dirname, 'dummy.pdf')));
        form.append('password', '12345');

        const response = await axios.post('http://localhost:3002/api/pdf/encrypt', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testEncrypt();
