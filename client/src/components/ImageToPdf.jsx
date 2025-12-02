import React, { useState } from 'react';
import axios from 'axios';
import { Image, Download, Loader2 } from 'lucide-react';
import FeatureCard from './FeatureCard';
import toast from 'react-hot-toast';

const ImageToPdf = () => {
    const [file, setFile] = useState(null);
    const [converting, setConverting] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
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
            const res = await axios.post('http://localhost:3002/api/pdf/image-to-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setDownloadUrl(`http://localhost:3002${res.data.downloadUrl}`);
            toast.success('Image converted successfully!', { id: loadingToast });
        } catch (err) {
            console.error(err);
            toast.error('Failed to convert image.', { id: loadingToast });
        } finally {
            setConverting(false);
        }
    };

    return (
        <FeatureCard
            title="Image to PDF"
            description="Convert PNG or JPG images to PDF format."
            icon={Image}
            color="pink"
        >
            <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-pink-50 file:text-pink-700
          hover:file:bg-pink-100 cursor-pointer"
            />

            <button
                onClick={handleConvert}
                disabled={converting}
                className={`w-full py-2.5 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2
          ${converting ? 'bg-pink-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700 shadow-md hover:shadow-lg'}`}
            >
                {converting ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Converting...
                    </>
                ) : (
                    'Convert to PDF'
                )}
            </button>

            {downloadUrl && (
                <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 text-center border border-pink-200 text-pink-700 rounded-lg hover:bg-pink-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                    <Download className="h-4 w-4" /> Download PDF
                </a>
            )}
        </FeatureCard>
    );
};

export default ImageToPdf;
