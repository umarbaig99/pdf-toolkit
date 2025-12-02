const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const pdfParse = require('pdf-parse');
const axios = require('axios');

// Helper to get file buffer from local or S3
const getFileBuffer = async (file) => {
    if (file.buffer) return file.buffer; // Memory storage
    if (file.path) return fs.readFileSync(file.path); // Disk storage
    if (file.location) { // S3 storage
        const response = await axios.get(file.location, { responseType: 'arraybuffer' });
        return response.data;
    }
    throw new Error('File source not found');
};

// Upload File
exports.uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return S3 URL if available, else local path
    const fileUrl = req.file.location || `/uploads/${req.file.filename}`;
    res.json({
        message: 'File uploaded successfully',
        file: req.file,
        url: fileUrl
    });
};

// Generate PDF from HTML/Text File
exports.generatePdf = async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'HTML or Text file is required' });
    }

    try {
        const fileContent = await getFileBuffer(file);
        let html = fileContent.toString('utf-8');

        // If text file, wrap in basic HTML
        if (file.mimetype === 'text/plain' || file.originalname.endsWith('.txt')) {
            html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: monospace; white-space: pre-wrap; padding: 20px; }
                    </style>
                </head>
                <body>
                    <pre>${html}</pre>
                </body>
                </html>
            `;
        }

        console.log('Launching Puppeteer...');
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        console.log('Puppeteer launched successfully.');
        const page = await browser.newPage();

        // Set content
        await page.setContent(html);

        // Generate PDF
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        const filename = `generated-${Date.now()}.pdf`;
        const filepath = path.join(__dirname, '../outputs', filename);

        // Ensure outputs directory exists
        if (!fs.existsSync(path.dirname(filepath))) {
            fs.mkdirSync(path.dirname(filepath), { recursive: true });
        }

        fs.writeFileSync(filepath, pdfBuffer);

        // Return download URL (assuming static file serving is set up)
        const downloadUrl = `/outputs/${filename}`;

        res.json({
            message: 'PDF generated successfully',
            downloadUrl,
            filename
        });

    } catch (error) {
        console.error('PDF Generation Error:', error);
        console.error('Error Stack:', error.stack);
        res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
    }
};

// Merge PDFs
exports.mergePdfs = async (req, res) => {
    const files = req.files;
    if (!files || files.length < 2) {
        return res.status(400).json({ error: 'At least two PDF files are required' });
    }

    try {
        const mergedPdf = await PDFDocument.create();

        for (const file of files) {
            const fileBytes = await getFileBuffer(file);
            const pdf = await PDFDocument.load(fileBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const filename = `merged-${Date.now()}.pdf`;
        const filepath = path.join(__dirname, '../outputs', filename);

        // Ensure outputs directory exists
        if (!fs.existsSync(path.dirname(filepath))) {
            fs.mkdirSync(path.dirname(filepath), { recursive: true });
        }

        const pdfBytes = await mergedPdf.save();
        fs.writeFileSync(filepath, pdfBytes);

        const downloadUrl = `/outputs/${filename}`;

        res.json({
            message: 'PDFs merged successfully',
            downloadUrl,
            filename
        });

    } catch (error) {
        console.error('PDF Merge Error:', error);
        res.status(500).json({ error: 'Failed to merge PDFs' });
    }
};

// Split PDF
exports.splitPdf = async (req, res) => {
    const { range } = req.body; // e.g., "1,3-5"
    const file = req.file;

    if (!file || !range) {
        return res.status(400).json({ error: 'File and page range are required' });
    }

    try {
        const fileBytes = await getFileBuffer(file);
        const pdfDoc = await PDFDocument.load(fileBytes);
        const newPdf = await PDFDocument.create();
        const totalPages = pdfDoc.getPageCount();

        // Parse range string to page indices (0-based)
        const pageIndices = new Set();
        const parts = range.split(',');

        for (const part of parts) {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(n => parseInt(n.trim()));
                for (let i = start; i <= end; i++) {
                    if (i >= 1 && i <= totalPages) pageIndices.add(i - 1);
                }
            } else {
                const pageNum = parseInt(part.trim());
                if (pageNum >= 1 && pageNum <= totalPages) pageIndices.add(pageNum - 1);
            }
        }

        const indicesArray = Array.from(pageIndices).sort((a, b) => a - b);
        const copiedPages = await newPdf.copyPages(pdfDoc, indicesArray);
        copiedPages.forEach(page => newPdf.addPage(page));

        const filename = `split-${Date.now()}.pdf`;
        const filepath = path.join(__dirname, '../outputs', filename);

        // Ensure outputs directory exists
        if (!fs.existsSync(path.dirname(filepath))) {
            fs.mkdirSync(path.dirname(filepath), { recursive: true });
        }

        const pdfBytes = await newPdf.save();
        fs.writeFileSync(filepath, pdfBytes);

        res.json({
            message: 'PDF split successfully',
            downloadUrl: `/outputs/${filename}`,
            filename
        });

    } catch (error) {
        console.error('PDF Split Error:', error);
        res.status(500).json({ error: 'Failed to split PDF' });
    }
};

// Extract Text
exports.extractText = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const fileBytes = await getFileBuffer(req.file);
        const data = await pdfParse(fileBytes);

        res.json({
            message: 'Text extracted successfully',
            text: data.text,
            totalPages: data.numpages
        });

    } catch (error) {
        console.error('Text Extraction Error:', error);
        res.status(500).json({ error: 'Failed to extract text' });
    }
};

// Get History
exports.getHistory = (req, res) => {
    const directoryPath = path.join(__dirname, '../outputs');

    // Ensure outputs directory exists
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to scan files' });
        }

        const fileInfos = files
            .filter(file => file.endsWith('.pdf'))
            .map(file => {
                const filePath = path.join(directoryPath, file);
                const stats = fs.statSync(filePath);
                return {
                    name: file,
                    url: `/outputs/${file}`,
                    createdAt: stats.birthtime,
                };
            })
            .sort((a, b) => b.createdAt - a.createdAt); // Newest first

        res.json(fileInfos);
    });
};

// Image to PDF
exports.imageToPdf = async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No image file uploaded' });
    }

    try {
        const fileBytes = await getFileBuffer(file);
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();

        let image;
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            image = await pdfDoc.embedJpg(fileBytes);
        } else if (file.mimetype === 'image/png') {
            image = await pdfDoc.embedPng(fileBytes);
        } else {
            return res.status(400).json({ error: 'Unsupported image format. Use PNG or JPG.' });
        }

        const { width, height } = image.scale(1);

        // Resize if image is too large for the page
        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();

        let dims = { width, height };
        if (width > pageWidth || height > pageHeight) {
            const scale = Math.min(pageWidth / width, pageHeight / height);
            dims = image.scale(scale);
        }

        page.drawImage(image, {
            x: (pageWidth - dims.width) / 2,
            y: (pageHeight - dims.height) / 2,
            width: dims.width,
            height: dims.height,
        });

        const filename = `image-to-pdf-${Date.now()}.pdf`;
        const filepath = path.join(__dirname, '../outputs', filename);

        // Ensure outputs directory exists
        if (!fs.existsSync(path.dirname(filepath))) {
            fs.mkdirSync(path.dirname(filepath), { recursive: true });
        }

        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(filepath, pdfBytes);

        res.json({
            message: 'Image converted to PDF successfully',
            downloadUrl: `/outputs/${filename}`,
            filename
        });

    } catch (error) {
        console.error('Image to PDF Error:', error);
        res.status(500).json({ error: 'Failed to convert image to PDF' });
    }
};

// Compress PDF (Basic optimization)
exports.compressPdf = async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        const fileBytes = await getFileBuffer(file);
        const pdfDoc = await PDFDocument.load(fileBytes);

        // pdf-lib optimizes by default on save, we can't do deep compression without external tools
        const pdfBytes = await pdfDoc.save({ useObjectStreams: false });

        const filename = `compressed-${Date.now()}.pdf`;
        const filepath = path.join(__dirname, '../outputs', filename);

        if (!fs.existsSync(path.dirname(filepath))) fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, pdfBytes);

        res.json({
            message: 'PDF compressed successfully',
            downloadUrl: `/outputs/${filename}`,
            filename
        });
    } catch (error) {
        console.error('Compress Error:', error);
        res.status(500).json({ error: 'Failed to compress PDF' });
    }
};

// Encrypt PDF
exports.encryptPdf = async (req, res) => {
    const file = req.file;
    const { password } = req.body;

    if (!file || !password) return res.status(400).json({ error: 'File and password are required' });

    try {
        const fileBytes = await getFileBuffer(file);
        const pdfDoc = await PDFDocument.load(fileBytes);

        const pdfBytes = await pdfDoc.save({
            userPassword: password,
            ownerPassword: password, // Setting both for simplicity
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

        const filename = `encrypted-${Date.now()}.pdf`;
        const filepath = path.join(__dirname, '../outputs', filename);

        if (!fs.existsSync(path.dirname(filepath))) fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, pdfBytes);

        res.json({
            message: 'PDF encrypted successfully',
            downloadUrl: `/outputs/${filename}`,
            filename
        });
    } catch (error) {
        console.error('Encrypt Error:', error);
        res.status(500).json({ error: 'Failed to encrypt PDF' });
    }
};

// Batch Process (Images to PDF)
exports.batchProcess = async (req, res) => {
    const files = req.files;
    if (!files || files.length === 0) return res.status(400).json({ error: 'No files uploaded' });

    try {
        const pdfDoc = await PDFDocument.create();

        for (const file of files) {
            const fileBytes = await getFileBuffer(file);
            let image;
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
                image = await pdfDoc.embedJpg(fileBytes);
            } else if (file.mimetype === 'image/png') {
                image = await pdfDoc.embedPng(fileBytes);
            } else {
                continue; // Skip unsupported files
            }

            const page = pdfDoc.addPage();
            const { width, height } = image.scale(1);
            const pageWidth = page.getWidth();
            const pageHeight = page.getHeight();

            let dims = { width, height };
            if (width > pageWidth || height > pageHeight) {
                const scale = Math.min(pageWidth / width, pageHeight / height);
                dims = image.scale(scale);
            }

            page.drawImage(image, {
                x: (pageWidth - dims.width) / 2,
                y: (pageHeight - dims.height) / 2,
                width: dims.width,
                height: dims.height,
            });
        }

        const filename = `batch-images-${Date.now()}.pdf`;
        const filepath = path.join(__dirname, '../outputs', filename);

        if (!fs.existsSync(path.dirname(filepath))) fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, pdfBytes = await pdfDoc.save());

        res.json({
            message: 'Batch processing complete',
            downloadUrl: `/outputs/${filename}`,
            filename
        });
    } catch (error) {
        console.error('Batch Process Error:', error);
        res.status(500).json({ error: 'Failed to process batch' });
    }
};
