import React, { useState } from 'react';
import axios from 'axios';
import { Layers, Download, Loader2 } from 'lucide-react';
import FeatureCard from './FeatureCard';
import toast from 'react-hot-toast';

const BatchProcessor = () => {
    const [files, setFiles] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFiles(e.target.files);
        setError('');
        setDownloadUrl('');
    };

    const handleProcess = async () => {
        if (!files || files.length === 0) {
            setError('Please select at least one image file.');
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        setProcessing(true);
        setError('');
        setDownloadUrl('');
        const loadingToast = toast.loading('Processing batch...');

        try {
            const res = await axios.post('http://localhost:3002/api/pdf/batch-process', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setDownloadUrl(`http://localhost:3002${res.data.downloadUrl}`);
            toast.success('Batch processed successfully!', { id: loadingToast });
        } catch (err) {
            console.error(err);
            setError('Failed to process batch.');
            toast.error('Failed to process batch.', { id: loadingToast });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <FeatureCard
            title="Batch Image to PDF"
            description="Convert multiple images into a single PDF."
            icon={Layers}
            color="indigo"
        >
            <input
                type="file"
                accept="image/png, image/jpeg"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-indigo-50 file:text-indigo-700
          hover:file:bg-indigo-100 cursor-pointer"
            />

            <button
                onClick={handleProcess}
                disabled={processing}
                className={`w-full py-2.5 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2
          ${processing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'}`}
            >
                {processing ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                    </>
                ) : (
                    'Process Batch'
                )}
            </button>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            {downloadUrl && (
                <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 text-center border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                    <Download className="h-4 w-4" /> Download Batch PDF
                </a>
            )}
        </FeatureCard>
    );
};

export default BatchProcessor;
