import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { Lock, Download, Loader2, Plus, FileText, X } from 'lucide-react';
import ToolLayout from './ToolLayout';
import toast from 'react-hot-toast';

const PdfEncryptor = () => {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState('');
    const [encrypting, setEncrypting] = useState(false);
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

    const handleEncrypt = async () => {
        if (!file || !password) {
            setError('Please select a file and enter a password.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('password', password);

        setEncrypting(true);
        setError('');
        setDownloadUrl('');
        const loadingToast = toast.loading('Encrypting PDF...');

        try {
            const res = await axios.post(`${API_URL}/api/pdf/encrypt`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setDownloadUrl(`${API_URL}${res.data.downloadUrl}`);
            toast.success('PDF encrypted successfully!', { id: loadingToast });
        } catch (err) {
            console.error(err);
            setError('Failed to encrypt PDF.');
            toast.error('Failed to encrypt PDF.', { id: loadingToast });
        } finally {
            setEncrypting(false);
        }
    };

    return (
        <ToolLayout
            title="Encrypt PDF"
            description="Secure your PDF files with a password."
            icon={Lock}
            color="accent"
        >
            <div className="space-y-8">
                {/* File Upload Area */}
                {!file ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-accent-400 transition-colors bg-slate-50/50">
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
                            <div className="p-4 bg-white rounded-full shadow-sm text-accent-600">
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

                {/* Password Input */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Set Password</label>
                    <input
                        type="password"
                        placeholder="Enter a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all outline-none"
                    />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4">
                    <button
                        onClick={handleEncrypt}
                        disabled={encrypting || !file || !password}
                        className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2
                        ${encrypting || !file || !password
                                ? 'bg-slate-300 cursor-not-allowed shadow-none transform-none'
                                : 'bg-gradient-to-r from-accent-600 to-accent-500'}`}
                    >
                        {encrypting ? (
                            <>
                                <Loader2 className="h-6 w-6 animate-spin" /> Encrypting...
                            </>
                        ) : (
                            <>
                                <Lock className="h-6 w-6" /> Encrypt PDF
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
                            <Download className="h-6 w-6" /> Download Encrypted PDF
                        </a>
                    )}
                </div>
            </div>
        </ToolLayout>
    );
};

export default PdfEncryptor;
