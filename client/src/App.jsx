import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PdfMerger from './components/PdfMerger';
import PdfSplitter from './components/PdfSplitter';
import PdfCompressor from './components/PdfCompressor';
import ImageToPdf from './components/ImageToPdf';
import TextExtractor from './components/TextExtractor';
import PdfEncryptor from './components/PdfEncryptor';
import PdfPreviewer from './components/PdfPreviewer';
import BatchProcessor from './components/BatchProcessor';
import PdfGenerator from './components/PdfGenerator';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected/Layout Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/dashboard" element={<Layout><Home /></Layout>} />

          <Route path="/tools/merge" element={<Layout><PdfMerger /></Layout>} />
          <Route path="/tools/split" element={<Layout><PdfSplitter /></Layout>} />
          <Route path="/tools/compress" element={<Layout><PdfCompressor /></Layout>} />
          <Route path="/tools/image-to-pdf" element={<Layout><ImageToPdf /></Layout>} />
          <Route path="/tools/extract-text" element={<Layout><TextExtractor /></Layout>} />
          <Route path="/tools/encrypt" element={<Layout><PdfEncryptor /></Layout>} />
          <Route path="/tools/preview" element={<Layout><PdfPreviewer /></Layout>} />
          <Route path="/tools/batch" element={<Layout><BatchProcessor /></Layout>} />
          <Route path="/tools/generate" element={<Layout><PdfGenerator /></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
