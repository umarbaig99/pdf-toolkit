import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { Layers, Download, Loader2, Plus, X, FileText } from 'lucide-react';
import ToolLayout from './ToolLayout';
import toast from 'react-hot-toast';

const PdfMerger = () => {
    const [files, setFiles] = useState([]);
    const [merging, setMerging] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files)]);
            setError('');
            setDownloadUrl('');
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
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
            const res = await axios.post(`${API_URL}/api/pdf/merge`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setDownloadUrl(`${API_URL}${res.data.downloadUrl}`);
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
        <ToolLayout
            title="Merge PDFs"
            description="Combine multiple PDF files into a single document. Drag and drop or select files to begin."
            icon={Layers}
            color="brand"
        >
            <div className="space-y-8">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-brand-400 transition-colors bg-slate-50/50">
                    <input
                        type="file"
                        multiple
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

                {/* File List */}
                {files.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="font-medium text-slate-700">Selected Files ({files.length})</h3>
                        <div className="grid gap-3">
                            {files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <span className="text-sm text-slate-600 truncate">{file.name}</span>
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-4">
                    <button
                        onClick={handleMerge}
                        disabled={merging || files.length < 2}
                        className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2
                        ${merging || files.length < 2
                                ? 'bg-slate-300 cursor-not-allowed shadow-none transform-none'
                                : 'bg-gradient-to-r from-brand-600 to-brand-500'}`}
                    >
                        {merging ? (
                            <>
                                <Loader2 className="h-6 w-6 animate-spin" /> Merging...
                            </>
                        ) : (
                            <>
                                <Layers className="h-6 w-6" /> Merge Files
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
                            <Download className="h-6 w-6" /> Download Merged PDF
                        </a>
                    )}
                </div>
            </div>
        </ToolLayout>
    );
};

export default PdfMerger;
