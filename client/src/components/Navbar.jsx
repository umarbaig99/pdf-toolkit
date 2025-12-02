import React from 'react';
import { FileText, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-white/20 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
                            PDFToolkit
                        </span>
                    </Link>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Features</Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-gray-700 font-medium">
                                    <User className="h-5 w-5 text-indigo-600" />
                                    <span>{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-medium transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-bold transition-colors">
                                    Sign In
                                </Link>
                                <Link to="/register" className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
