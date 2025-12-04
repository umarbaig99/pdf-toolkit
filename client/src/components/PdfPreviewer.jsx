import React, { useState } from 'react';
import { Eye, Plus, FileText, X } from 'lucide-react';
import ToolLayout from './ToolLayout';

const PdfPreviewer = () => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
        }
    };

    const removeFile = () => {
        setFile(null);
        setPreviewUrl('');
    };

    return (
        <ToolLayout
            title="Preview PDF"
            description="View PDF files directly in your browser without downloading."
            icon={Eye}
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

                {/* Preview Area */}
                {previewUrl && (
                    <div className="w-full h-[800px] border border-slate-200 rounded-2xl overflow-hidden shadow-lg bg-slate-900">
                        <iframe
                            src={previewUrl}
                            className="w-full h-full"
                            title="PDF Preview"
                        />
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default PdfPreviewer;
