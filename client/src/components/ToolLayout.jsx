import React from 'react';

const colorVariants = {
    brand: {
        bg: 'bg-brand-100',
        text: 'text-brand-600'
    },
    accent: {
        bg: 'bg-accent-100',
        text: 'text-accent-600'
    },
    slate: {
        bg: 'bg-slate-100',
        text: 'text-slate-600'
    },
    orange: {
        bg: 'bg-orange-100',
        text: 'text-orange-600'
    },
    green: {
        bg: 'bg-green-100',
        text: 'text-green-600'
    },
    pink: {
        bg: 'bg-pink-100',
        text: 'text-pink-600'
    },
    teal: {
        bg: 'bg-teal-100',
        text: 'text-teal-600'
    },
    purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600'
    },
    indigo: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-600'
    },
    blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-600'
    }
};

const ToolLayout = ({ title, description, icon: Icon, children, color = "brand" }) => {
    const theme = colorVariants[color] || colorVariants.brand;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
                <div className={`inline-flex p-4 rounded-2xl ${theme.bg} ${theme.text} mb-4 shadow-sm`}>
                    <Icon className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">{title}</h1>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto">{description}</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-6 sm:p-10">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ToolLayout;
