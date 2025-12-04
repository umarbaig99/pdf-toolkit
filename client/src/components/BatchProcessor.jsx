import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { Layers, Download, Loader2, Plus, FileText, X } from 'lucide-react';
import ToolLayout from './ToolLayout';
import toast from 'react-hot-toast';

const BatchProcessor = () => {
    const [files, setFiles] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(Array.from(e.target.files));
            setError('');
            setDownloadUrl('');
        }
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
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
            const res = await axios.post(`${API_URL}/api/pdf/batch-process`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setDownloadUrl(`${API_URL}${res.data.downloadUrl}`);
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
        <ToolLayout
            title="Batch Image to PDF"
            description="Convert multiple images into a single PDF document instantly."
            icon={Layers}
            color="accent"
        >
            <div className="space-y-8">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-accent-400 transition-colors bg-slate-50/50">
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center gap-4"
                    >
                        <div className="p-4 bg-white rounded-full shadow-sm text-accent-600">
                            <Plus className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-slate-700">Click to upload images</p>
                            <p className="text-sm text-slate-400">PNG, JPG files supported</p>
                        </div>
                    </label>
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Selected Files ({files.length})</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-700 text-sm">{file.name}</p>
                                            <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-4">
                    <button
                        onClick={handleProcess}
                        disabled={processing || files.length === 0}
                        className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2
                        ${processing || files.length === 0
                                ? 'bg-slate-300 cursor-not-allowed shadow-none transform-none'
                                : 'bg-gradient-to-r from-accent-600 to-accent-500'}`}
                    >
                        {processing ? (
                            <>
                                <Loader2 className="h-6 w-6 animate-spin" /> Processing...
                            </>
                        ) : (
                            <>
                                <Layers className="h-6 w-6" /> Process Batch
                            </>
                        )}
                    </button>

                    {error && <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>}

                    {downloadUrl && (
                        <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-4 text-center border-2 border-accent-100 text-accent-600 rounded-xl hover:bg-accent-50 transition-colors font-bold text-lg flex items-center justify-center gap-2"
                        >
                            <Download className="h-6 w-6" /> Download Batch PDF
                        </a>
                    )}
                </div>
            </div>
        </ToolLayout>
    );
};

export default BatchProcessor;
