
import React from 'react';

interface LoaderProps {
    message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-slate-800/50 rounded-lg">
            <div className="w-12 h-12 border-4 border-t-indigo-400 border-slate-600 rounded-full animate-spin"></div>
            <p className="text-slate-300 text-center animate-pulse-fast">{message}</p>
        </div>
    );
};

export default Loader;
