const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const upload = require('../middleware/upload');

// Routes
router.post('/upload', upload.single('file'), pdfController.uploadFile);
router.post('/generate', upload.single('file'), pdfController.generatePdf);
router.post('/merge', upload.array('files', 10), pdfController.mergePdfs);
router.post('/split', upload.single('file'), pdfController.splitPdf);
router.post('/extract-text', upload.single('file'), pdfController.extractText);
router.post('/image-to-pdf', upload.single('file'), pdfController.imageToPdf);
router.post('/compress', upload.single('file'), pdfController.compressPdf);
router.post('/encrypt', upload.single('file'), pdfController.encryptPdf);
router.post('/batch-process', upload.array('files', 20), pdfController.batchProcess);
router.get('/history', pdfController.getHistory);

module.exports = router;
