import React from 'react';

const FeatureCard = ({ title, description, icon: Icon, children, color = "indigo" }) => {
    const colorClasses = {
        indigo: "from-indigo-500 to-blue-500 shadow-indigo-500/20",
        purple: "from-purple-500 to-pink-500 shadow-purple-500/20",
        teal: "from-teal-400 to-emerald-500 shadow-teal-500/20",
        orange: "from-orange-400 to-red-500 shadow-orange-500/20",
        blue: "from-blue-400 to-cyan-500 shadow-blue-500/20",
    };

    const gradient = colorClasses[color] || colorClasses.indigo;

    return (
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl">
            <div className="p-8">
                <div className="flex items-center gap-5 mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{description}</p>
                    </div>
                </div>
                <div className="space-y-5">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FeatureCard;
