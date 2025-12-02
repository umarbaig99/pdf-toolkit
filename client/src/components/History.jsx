import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PdfPreview from './PdfPreview';
import { Clock, Download, Eye, FileText } from 'lucide-react';

const History = () => {
    const [history, setHistory] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:3002/api/pdf/history');
            setHistory(res.data);
        } catch (err) {
            console.error('Failed to fetch history', err);
        }
    };

    useEffect(() => {
        fetchHistory();
        const interval = setInterval(fetchHistory, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                    <Clock className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Recent Jobs</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50/50 text-xs uppercase font-semibold text-gray-500">
                        <tr>
                            <th className="px-8 py-5">File Name</th>
                            <th className="px-8 py-5">Created At</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="px-8 py-10 text-center text-gray-400">
                                    No recent jobs found.
                                </td>
                            </tr>
                        ) : (
                            history.map((file) => (
                                <tr key={file.name} className="hover:bg-white/50 transition-colors">
                                    <td className="px-8 py-5 font-medium text-gray-900 flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-gray-400" />
                                        {file.name}
                                    </td>
                                    <td className="px-8 py-5">
                                        {new Date(file.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-8 py-5 text-right space-x-2">
                                        <button
                                            onClick={() => setPreviewUrl(`http://localhost:3002${file.url}`)}
                                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                                        >
                                            <Eye className="h-3 w-3 mr-1" /> Preview
                                        </button>
                                        <a
                                            href={`http://localhost:3002${file.url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                        >
                                            <Download className="h-3 w-3 mr-1" /> Download
                                        </a>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {previewUrl && (
                <PdfPreview fileUrl={previewUrl} onClose={() => setPreviewUrl(null)} />
            )}
        </div>
    );
};

export default History;
