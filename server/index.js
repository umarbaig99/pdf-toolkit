const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'PDF Toolkit Server is running' });
});

// Routes
const pdfRoutes = require('./routes/pdfRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/pdf', pdfRoutes);
app.use('/api/auth', authRoutes);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));

// Serve React App in Production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
        // Exclude API routes from catch-all
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ error: 'API route not found' });
        }
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
}

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Using ${process.env.AWS_BUCKET_NAME ? 'S3' : 'Local Disk'} Storage`);
});
