import React, { useState } from 'react';
import axios from 'axios';
import { Scissors, Download, Loader2 } from 'lucide-react';
import FeatureCard from './FeatureCard';
import toast from 'react-hot-toast';

const PdfSplitter = () => {
    const [file, setFile] = useState(null);
    const [range, setRange] = useState('');
    const [splitting, setSplitting] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
        setDownloadUrl('');
    };

    const handleSplit = async () => {
        if (!file || !range) {
            setError('Please select a file and specify a page range.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('range', range);

        setSplitting(true);
        const loadingToast = toast.loading('Splitting PDF...');
        try {
            const res = await axios.post('http://localhost:3002/api/pdf/split', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setDownloadUrl(`http://localhost:3002${res.data.downloadUrl}`);
            toast.success('PDF split successfully!', { id: loadingToast });
        } catch (err) {
            console.error(err);
            setError('Failed to split PDF.');
            toast.error('Failed to split PDF.', { id: loadingToast });
        } finally {
            setSplitting(false);
        }
    };

    return (
        <FeatureCard
            title="Split PDF"
            description="Extract specific pages or ranges from your PDF."
            icon={Scissors}
            color="orange"
        >
            <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-orange-50 file:text-orange-700
          hover:file:bg-orange-100 cursor-pointer"
            />

            <input
                type="text"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="e.g., 1, 3-5, 8"
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />

            <button
                onClick={handleSplit}
                disabled={splitting}
                className={`w-full py-2.5 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2
          ${splitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 shadow-md hover:shadow-lg'}`}
            >
                {splitting ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Splitting...
                    </>
                ) : (
                    'Split PDF'
                )}
            </button>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            {downloadUrl && (
                <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 text-center border border-orange-200 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                    <Download className="h-4 w-4" /> Download Split PDF
                </a>
            )}
        </FeatureCard>
    );
};

export default PdfSplitter;
