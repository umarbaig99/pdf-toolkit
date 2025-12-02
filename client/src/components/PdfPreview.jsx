import React from 'react';

const PdfPreview = ({ url, onClose }) => {
    if (!url) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">PDF Preview</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 font-bold text-xl"
                    >
                        &times;
                    </button>
                </div>
                <div className="flex-1 p-2 bg-gray-100">
                    <iframe
                        src={url}
                        className="w-full h-full border-none rounded"
                        title="PDF Preview"
                    />
                </div>
            </div>
        </div>
    );
};

export default PdfPreview;
