import React from 'react';
import { Link } from 'react-router-dom';
import {
    Layers,
    Scissors,
    Minimize2,
    Image,
    FileText,
    Lock,
    Eye,
    Cpu,
    FilePlus,
    ArrowRight
} from 'lucide-react';

const tools = [
    {
        name: 'Merge PDF',
        description: 'Combine multiple PDFs into one.',
        icon: Layers,
        path: '/tools/merge',
        color: 'brand'
    },
    {
        name: 'Split PDF',
        description: 'Separate a PDF into individual pages.',
        icon: Scissors,
        path: '/tools/split',
        color: 'accent'
    },
    {
        name: 'Compress PDF',
        description: 'Reduce file size while maintaining quality.',
        icon: Minimize2,
        path: '/tools/compress',
        color: 'brand'
    },
    {
        name: 'Image to PDF',
        description: 'Convert JPG, PNG images to PDF.',
        icon: Image,
        path: '/tools/image-to-pdf',
        color: 'accent'
    },
    {
        name: 'Extract Text',
        description: 'Extract text content from PDF files.',
        icon: FileText,
        path: '/tools/extract-text',
        color: 'brand'
    },
    {
        name: 'Encrypt PDF',
        description: 'Password protect your PDF files.',
        icon: Lock,
        path: '/tools/encrypt',
        color: 'accent'
    },
    {
        name: 'Preview PDF',
        description: 'View PDF files directly in your browser.',
        icon: Eye,
        path: '/tools/preview',
        color: 'brand'
    },
    {
        name: 'Batch Process',
        description: 'Process multiple files at once.',
        icon: Cpu,
        path: '/tools/batch',
        color: 'accent'
    },
    {
        name: 'Generate PDF',
        description: 'Create PDF files from scratch.',
        icon: FilePlus,
        path: '/tools/generate',
        color: 'brand'
    },
];

const Home = () => {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-4 py-8">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900">
                    Your All-in-One <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600">PDF Toolkit</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Manage your documents with ease. Merge, split, compress, and convert PDFs securely in your browser.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <Link
                            key={tool.path}
                            to={tool.path}
                            className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className={`inline-flex p-3 rounded-xl bg-${tool.color}-50 text-${tool.color}-600 mb-4 group-hover:scale-110 transition-transform`}>
                                <Icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{tool.name}</h3>
                            <p className="text-slate-500 mb-4">{tool.description}</p>
                            <div className={`flex items-center text-${tool.color}-600 font-medium text-sm group-hover:gap-2 transition-all`}>
                                Try it now <ArrowRight className="h-4 w-4 ml-1" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
