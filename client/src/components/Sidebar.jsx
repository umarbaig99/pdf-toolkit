import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Scissors,
    Minimize2,
    Image,
    Layers,
    Lock,
    Eye,
    Cpu,
    FilePlus
} from 'lucide-react';
import logo from '../assets/logo.png';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Merge PDF', icon: Layers, path: '/tools/merge' },
        { name: 'Split PDF', icon: Scissors, path: '/tools/split' },
        { name: 'Compress PDF', icon: Minimize2, path: '/tools/compress' },
        { name: 'Image to PDF', icon: Image, path: '/tools/image-to-pdf' },
        { name: 'Extract Text', icon: FileText, path: '/tools/extract-text' },
        { name: 'Encrypt PDF', icon: Lock, path: '/tools/encrypt' },
        { name: 'Preview PDF', icon: Eye, path: '/tools/preview' },
        { name: 'Batch Process', icon: Cpu, path: '/tools/batch' },
        { name: 'Generate PDF', icon: FilePlus, path: '/tools/generate' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-300 transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-100">
                    <img src={logo} alt="Logo" className="h-8" />
                    <span className="font-heading font-bold text-xl text-slate-900">PDF Toolkit</span>
                </div>

                <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-brand-50 text-brand-700 font-medium shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <Icon className={`h-5 w-5 ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
