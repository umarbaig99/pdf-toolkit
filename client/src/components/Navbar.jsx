import React from 'react';
import { LogOut, User, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-heading font-semibold text-slate-800 lg:hidden">
                    PDF Toolkit
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="text-slate-600 hover:text-brand-600 font-medium text-sm px-3 py-2">
                            Sign In
                        </Link>
                        <Link to="/register" className="bg-brand-600 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-brand-700 transition-all shadow-md hover:shadow-lg">
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
