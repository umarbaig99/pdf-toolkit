import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const Hero = () => {
    return (
        <div className="relative overflow-hidden pt-20 pb-32">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/20 text-indigo-600 text-sm font-semibold mb-8 shadow-sm">
                    <Sparkles className="h-4 w-4" />
                    <span className="">The Ultimate PDF Powerhouse</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
                    Transform Your PDFs with <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                        Vibrant Precision
                    </span>
                </h1>

                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 mb-10 leading-relaxed">
                    Merge, split, and edit your documents with a toolkit that's as beautiful as it is powerful.
                    Fast, secure, and completely free.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                    <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1">
                        Get Started Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                    <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md">
                        View Features
                    </button>
                </div>

                <div className="flex justify-center gap-8 text-sm font-medium text-gray-500">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                        <span>No Signup Required</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                        <span>100% Secure</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                        <span>Free Forever</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
