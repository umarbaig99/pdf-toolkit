import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="lg:ml-64 min-h-screen flex flex-col transition-all duration-300">
                <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>

                <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
                    &copy; {new Date().getFullYear()} PDF Toolkit. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default Layout;
