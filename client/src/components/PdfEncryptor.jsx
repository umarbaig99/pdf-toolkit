import React, { useState } from 'react';
import axios from 'axios';
import { Lock, Download, Loader2 } from 'lucide-react';
import FeatureCard from './FeatureCard';
import toast from 'react-hot-toast';

const PdfEncryptor = () => {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState('');
    const [encrypting, setEncrypting] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
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
            const res = await axios.post('http://localhost:3002/api/pdf/encrypt', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setDownloadUrl(`http://localhost:3002${res.data.downloadUrl}`);
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
        <FeatureCard
            title="Encrypt PDF"
            description="Secure your PDF with a password."
            icon={Lock}
            color="purple"
        >
            <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-purple-50 file:text-purple-700
          hover:file:bg-purple-100 cursor-pointer"
            />

            <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
            />

            <button
                onClick={handleEncrypt}
                disabled={encrypting}
                className={`w-full py-2.5 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2
          ${encrypting ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg'}`}
            >
                {encrypting ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Encrypting...
                    </>
                ) : (
                    'Encrypt PDF'
                )}
            </button>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            {downloadUrl && (
                <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 text-center border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                    <Download className="h-4 w-4" /> Download Encrypted PDF
                </a>
            )}
        </FeatureCard>
    );
};

export default PdfEncryptor;
