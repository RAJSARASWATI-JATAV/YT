
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900/50 border-t border-slate-800 mt-auto">
            <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm text-slate-400">
                    Powered by the Google Gemini API. Created with React & Tailwind CSS.
                </p>
                 <p className="text-sm text-slate-500 mt-1">
                    Enhanced by RAJSARASWATI JATAV.
                </p>
            </div>
        </footer>
    );
};

export default Footer;