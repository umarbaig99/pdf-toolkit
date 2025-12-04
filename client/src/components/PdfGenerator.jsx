import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { FileText, Download, Loader2, Plus, X } from 'lucide-react';
import ToolLayout from './ToolLayout';
import toast from 'react-hot-toast';

const PdfGenerator = () => {
    const [file, setFile] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
            setDownloadUrl('');
        }
    };

    const removeFile = () => {
        setFile(null);
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
            const res = await axios.post(`${API_URL}/api/pdf/generate`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setDownloadUrl(`${API_URL}${res.data.downloadUrl}`);
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
        <ToolLayout
            title="Generate PDF"
            description="Create professional PDFs from HTML or Text files instantly."
            icon={FileText}
            color="brand"
        >
            <div className="space-y-8">
                {/* File Upload Area */}
                {!file ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-brand-400 transition-colors bg-slate-50/50">
                        <input
                            type="file"
                            accept=".html,.txt"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center gap-4"
                        >
                            <div className="p-4 bg-white rounded-full shadow-sm text-brand-600">
                                <Plus className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-lg font-medium text-slate-700">Click to upload or drag and drop</p>
                                <p className="text-sm text-slate-400">HTML, TXT files only</p>
                            </div>
                        </label>
                    </div>
                ) : (
                    <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-50 text-red-500 rounded-lg">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-700">{file.name}</p>
                                <p className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button
                            onClick={removeFile}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-4">
                    <button
                        onClick={handleGenerate}
                        disabled={generating || !file}
                        className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2
                        ${generating || !file
                                ? 'bg-slate-300 cursor-not-allowed shadow-none transform-none'
                                : 'bg-gradient-to-r from-brand-600 to-brand-500'}`}
                    >
                        {generating ? (
                            <>
                                <Loader2 className="h-6 w-6 animate-spin" /> Generating...
                            </>
                        ) : (
                            <>
                                <FileText className="h-6 w-6" /> Generate PDF
                            </>
                        )}
                    </button>

                    {error && <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>}

                    {downloadUrl && (
                        <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-4 text-center border-2 border-brand-100 text-brand-600 rounded-xl hover:bg-brand-50 transition-colors font-bold text-lg flex items-center justify-center gap-2"
                        >
                            <Download className="h-6 w-6" /> Download PDF
                        </a>
                    )}
                </div>
            </div>
        </ToolLayout>
    );
};

export default PdfGenerator;
