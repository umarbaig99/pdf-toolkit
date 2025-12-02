import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PdfGenerator from '../components/PdfGenerator';
import PdfMerger from '../components/PdfMerger';
import PdfSplitter from '../components/PdfSplitter';
import TextExtractor from '../components/TextExtractor';
import ImageToPdf from '../components/ImageToPdf';
import PdfCompressor from '../components/PdfCompressor';
import PdfEncryptor from '../components/PdfEncryptor';
import PdfPreviewer from '../components/PdfPreviewer';
import BatchProcessor from '../components/BatchProcessor';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-sans text-gray-900">
            <Navbar />
            <Hero />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <PdfGenerator />
                    <PdfSplitter />
                    <TextExtractor />
                    <ImageToPdf />
                    <PdfMerger />
                    <PdfCompressor />
                    <PdfEncryptor />
                    <PdfPreviewer />
                    <BatchProcessor />
                </div>
            </main>

            <footer className="bg-white border-t border-gray-100 py-12 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} PDFToolkit. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
