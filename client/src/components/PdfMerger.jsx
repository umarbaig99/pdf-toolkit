import React, { useState } from 'react';
import axios from 'axios';
import { Layers, Download, Loader2, Plus } from 'lucide-react';
import FeatureCard from './FeatureCard';
import toast from 'react-hot-toast';

const PdfMerger = () => {
    const [files, setFiles] = useState([]);
    const [merging, setMerging] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
        setError('');
        setDownloadUrl('');
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            setError('Please select at least 2 PDF files.');
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        setMerging(true);
        const loadingToast = toast.loading('Merging PDFs...');
        try {
            const res = await axios.post('http://localhost:3002/api/pdf/merge', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setDownloadUrl(`http://localhost:3002${res.data.downloadUrl}`);
            toast.success('PDFs merged successfully!', { id: loadingToast });
        } catch (err) {
            console.error(err);
            setError('Failed to merge PDFs.');
            toast.error('Failed to merge PDFs.', { id: loadingToast });
        } finally {
            setMerging(false);
        }
    };

    return (
        <FeatureCard
            title="Merge PDFs"
            description="Combine multiple PDF files into a single document."
            icon={Layers}
            color="purple"
        >
            <div className="relative">
                <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-purple-50 file:text-purple-700
            hover:file:bg-purple-100 cursor-pointer"
                />
            </div>

            {files.length > 0 && (
                <p className="text-xs text-gray-500 text-center">{files.length} files selected</p>
            )}

            <button
                onClick={handleMerge}
                disabled={merging}
                className={`w-full py-2.5 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2
          ${merging ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg'}`}
            >
                {merging ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Merging...
                    </>
                ) : (
                    <>
                        <Plus className="h-4 w-4" /> Merge Files
                    </>
                )}
            </button>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            {downloadUrl && (
                <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 text-center border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                    <Download className="h-4 w-4" /> Download Merged
                </a>
            )}
        </FeatureCard>
    );
};

export default PdfMerger;
