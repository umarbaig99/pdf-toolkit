import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const res = await axios.post(`${API_URL}/api/pdf/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(`Success: ${res.data.message}`);
        } catch (err) {
            console.error(err);
            setMessage('Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload PDF</h2>
            <div className="flex flex-col space-y-4">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
                />
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className={`px-4 py-2 rounded text-white font-medium transition
            ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {uploading ? 'Uploading...' : 'Upload File'}
                </button>
                {message && (
                    <p className={`text-sm ${message.startsWith('Success') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
