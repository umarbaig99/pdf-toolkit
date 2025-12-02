import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import FeatureCard from './FeatureCard';

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

    return (
        <FeatureCard
            title="Preview PDF"
            description="View PDF files directly in your browser."
            icon={Eye}
            color="orange"
        >
            <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-orange-50 file:text-orange-700
          hover:file:bg-orange-100 cursor-pointer"
            />

            {previewUrl && (
                <div className="mt-4 w-full h-64 border border-gray-200 rounded-lg overflow-hidden">
                    <iframe
                        src={previewUrl}
                        className="w-full h-full"
                        title="PDF Preview"
                    />
                </div>
            )}
        </FeatureCard>
    );
};

export default PdfPreviewer;
