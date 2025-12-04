import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { FileJson, Download, Loader2, FileText, Plus, X } from 'lucide-react';
import ToolLayout from './ToolLayout';
import toast from 'react-hot-toast';

const TextExtractor = () => {
    const [file, setFile] = useState(null);
    const [extracting, setExtracting] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
            setExtractedText('');
        }
    };

    const removeFile = () => {
        setFile(null);
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
            const res = await axios.post(`${API_URL}/api/pdf/extract-text`, formData, {
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
        <ToolLayout
            title="Extract Text"
            description="Pull raw text content from your PDF files instantly."
            icon={FileJson}
            color="brand"
        >
            <div className="space-y-8">
                {/* File Upload Area */}
                {!file ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-brand-400 transition-colors bg-slate-50/50">
                        <input
                            type="file"
                            accept=".pdf"
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
                                <p className="text-sm text-slate-400">PDF files only</p>
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
                        onClick={handleExtract}
                        disabled={extracting || !file}
                        className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2
                        ${extracting || !file
                                ? 'bg-slate-300 cursor-not-allowed shadow-none transform-none'
                                : 'bg-gradient-to-r from-brand-600 to-brand-500'}`}
                    >
                        {extracting ? (
                            <>
                                <Loader2 className="h-6 w-6 animate-spin" /> Extracting...
                            </>
                        ) : (
                            <>
                                <FileJson className="h-6 w-6" /> Extract Text
                            </>
                        )}
                    </button>

                    {error && <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>}
                </div>

                {/* Extracted Text Result */}
                {extractedText && (
                    <div className="mt-8 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800">Extracted Content</h3>
                            <button
                                onClick={handleDownload}
                                className="px-4 py-2 bg-brand-50 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-100 transition-colors flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" /> Download .txt
                            </button>
                        </div>
                        <div className="relative">
                            <textarea
                                readOnly
                                value={extractedText}
                                className="w-full h-64 p-6 border border-slate-200 rounded-2xl text-sm font-mono bg-slate-50 text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                            />
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default TextExtractor;
