import React, { useState } from 'react';
import axios from 'axios';
import { Minimize2, Download, Loader2 } from 'lucide-react';
import FeatureCard from './FeatureCard';
import toast from 'react-hot-toast';

const PdfCompressor = () => {
    const [file, setFile] = useState(null);
    const [compressing, setCompressing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
        setDownloadUrl('');
    };

    const handleCompress = async () => {
        if (!file) {
            setError('Please select a PDF file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setCompressing(true);
        setError('');
        setDownloadUrl('');
        const loadingToast = toast.loading('Compressing PDF...');

        try {
            const res = await axios.post('http://localhost:3002/api/pdf/compress', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setDownloadUrl(`http://localhost:3002${res.data.downloadUrl}`);
            toast.success('PDF compressed successfully!', { id: loadingToast });
        } catch (err) {
            console.error(err);
            setError('Failed to compress PDF.');
            toast.error('Failed to compress PDF.', { id: loadingToast });
        } finally {
            setCompressing(false);
        }
    };

    return (
        <FeatureCard
            title="Compress PDF"
            description="Reduce file size while maintaining quality."
            icon={Minimize2}
            color="green"
        >
            <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-green-50 file:text-green-700
          hover:file:bg-green-100 cursor-pointer"
            />

            <button
                onClick={handleCompress}
                disabled={compressing}
                className={`w-full py-2.5 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2
          ${compressing ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'}`}
            >
                {compressing ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Compressing...
                    </>
                ) : (
                    'Compress PDF'
                )}
            </button>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            {downloadUrl && (
                <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 text-center border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                    <Download className="h-4 w-4" /> Download Compressed PDF
                </a>
            )}
        </FeatureCard>
    );
};

export default PdfCompressor;
