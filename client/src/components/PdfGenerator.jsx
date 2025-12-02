import React, { useState } from 'react';
import axios from 'axios';
import { FileText, Download, Loader2 } from 'lucide-react';
import FeatureCard from './FeatureCard';
import toast from 'react-hot-toast';

const PdfGenerator = () => {
    const [file, setFile] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
        setDownloadUrl('');
    };

    const handleGenerate = async () => {
        if (!file) {
            setError('Please select an HTML or Text file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setGenerating(true);
        setError('');
        setDownloadUrl('');
        const loadingToast = toast.loading('Generating PDF...');

        try {
            const res = await axios.post('http://localhost:3002/api/pdf/generate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setDownloadUrl(`http://localhost:3002${res.data.downloadUrl}`);
            toast.success('PDF generated successfully!', { id: loadingToast });
        } catch (err) {
            console.error(err);
            setError('Failed to generate PDF.');
            toast.error('Failed to generate PDF.', { id: loadingToast });
        } finally {
            setGenerating(false);
        }
    };

    return (
        <FeatureCard
            title="Generate PDF"
            description="Create professional PDFs from HTML or Text files."
            icon={FileText}
            color="blue"
        >
            <input
                type="file"
                accept=".html,.txt"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100 cursor-pointer"
            />

            <button
                onClick={handleGenerate}
                disabled={generating}
                className={`w-full py-2.5 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2
          ${generating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
            >
                {generating ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                    </>
                ) : (
                    'Generate PDF'
                )}
            </button>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            {downloadUrl && (
                <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 text-center border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                    <Download className="h-4 w-4" /> Download PDF
                </a>
            )}
        </FeatureCard>
    );
};

export default PdfGenerator;
