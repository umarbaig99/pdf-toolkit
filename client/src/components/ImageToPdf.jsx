import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { Image, Download, Loader2, Plus, FileText, X } from 'lucide-react';
import ToolLayout from './ToolLayout';
import toast from 'react-hot-toast';

const ImageToPdf = () => {
    const [file, setFile] = useState(null);
    const [converting, setConverting] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setDownloadUrl('');
        }
    };

    const removeFile = () => {
        setFile(null);
        setDownloadUrl('');
    };

    const handleConvert = async () => {
        if (!file) {
            toast.error('Please select an image file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setConverting(true);
        const loadingToast = toast.loading('Converting image...');

        try {
            const res = await axios.post(`${API_URL}/api/pdf/image-to-pdf`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setDownloadUrl(`${API_URL}${res.data.downloadUrl}`);
            toast.success('Image converted successfully!', { id: loadingToast });
        } catch (err) {
            console.error(err);
            toast.error('Failed to convert image.', { id: loadingToast });
        } finally {
            setConverting(false);
        }
    };

    return (
        <ToolLayout
            title="Image to PDF"
            description="Convert PNG or JPG images to PDF format instantly."
            icon={Image}
            color="accent"
        >
            <div className="space-y-8">
                {/* File Upload Area */}
                {!file ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-accent-400 transition-colors bg-slate-50/50">
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
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
                                <p className="text-lg font-medium text-slate-700">Click to upload or drag and drop</p>
                                <p className="text-sm text-slate-400">PNG, JPG files only</p>
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
                        onClick={handleConvert}
                        disabled={converting || !file}
                        className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2
                        ${converting || !file
                                ? 'bg-slate-300 cursor-not-allowed shadow-none transform-none'
                                : 'bg-gradient-to-r from-accent-600 to-accent-500'}`}
                    >
                        {converting ? (
                            <>
                                <Loader2 className="h-6 w-6 animate-spin" /> Converting...
                            </>
                        ) : (
                            <>
                                <Image className="h-6 w-6" /> Convert to PDF
                            </>
                        )}
                    </button>

                    {downloadUrl && (
                        <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-4 text-center border-2 border-accent-100 text-accent-600 rounded-xl hover:bg-accent-50 transition-colors font-bold text-lg flex items-center justify-center gap-2"
                        >
                            <Download className="h-6 w-6" /> Download PDF
                        </a>
                    )}
                </div>
            </div>
        </ToolLayout>
    );
};

export default ImageToPdf;
