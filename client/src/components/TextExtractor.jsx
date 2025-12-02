import React, { useState } from 'react';
import axios from 'axios';
import { FileJson, Download, Loader2, FileText } from 'lucide-react';
import FeatureCard from './FeatureCard';
import toast from 'react-hot-toast';

const TextExtractor = () => {
    const [file, setFile] = useState(null);
    const [extracting, setExtracting] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
        setExtractedText('');
    };

    const handleExtract = async () => {
        if (!file) {
            setError('Please select a file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setExtracting(true);
        const loadingToast = toast.loading('Extracting text...');
        try {
            const res = await axios.post('http://localhost:3002/api/pdf/extract-text', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setExtractedText(res.data.text);
            toast.success('Text extracted successfully!', { id: loadingToast });
        } catch (err) {
            console.error(err);
            setError('Failed to extract text.');
            toast.error('Failed to extract text.', { id: loadingToast });
        } finally {
            setExtracting(false);
        }
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([extractedText], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "extracted-text.txt";
        document.body.appendChild(element);
        element.click();
    }

    return (
        <FeatureCard
            title="Extract Text"
            description="Pull raw text content from your PDF files."
            icon={FileJson}
            color="teal"
        >
            <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-teal-50 file:text-teal-700
          hover:file:bg-teal-100 cursor-pointer"
            />

            <button
                onClick={handleExtract}
                disabled={extracting}
                className={`w-full py-2.5 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2
          ${extracting ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg'}`}
            >
                {extracting ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Extracting...
                    </>
                ) : (
                    'Extract Text'
                )}
            </button>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            {extractedText && (
                <div className="mt-2">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Preview</span>
                        <button
                            onClick={handleDownload}
                            className="text-xs text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1"
                        >
                            <Download className="h-3 w-3" /> Download .txt
                        </button>
                    </div>
                    <textarea
                        readOnly
                        value={extractedText}
                        className="w-full h-32 p-3 border border-gray-200 rounded-lg text-xs font-mono bg-gray-50 resize-none focus:outline-none"
                    />
                </div>
            )}
        </FeatureCard>
    );
};

export default TextExtractor;
