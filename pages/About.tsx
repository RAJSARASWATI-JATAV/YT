import React from 'react';

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const About: React.FC = () => {
    return (
        <div className="animate-fade-in flex flex-col items-center justify-center pt-8">
            <div className="w-full max-w-2xl bg-slate-800/50 p-8 rounded-xl shadow-2xl border border-slate-700 text-center">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
                    About the Developer
                </h2>
                
                <div className="my-6">
                    <div className="inline-block p-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full">
                        <div className="bg-slate-800 rounded-full p-2">
                             <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <h3 className="text-3xl font-bold text-slate-100">
                    RAJSARASWATI JATAV
                </h3>
                <p className="mt-4 text-lg text-slate-400">
                    This Gemini Creative Content Suite was enhanced and brought to life by me. I am passionate about building innovative applications with cutting-edge AI. Connect with me!
                </p>

                <div className="mt-8 flex justify-center items-center gap-6">
                    <a
                        href="https://github.com/RAJSARASWATI-JATAV"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200"
                    >
                        <GitHubIcon />
                        <span className="font-semibold">GitHub</span>
                    </a>
                    <a
                        href="https://www.instagram.com/OFFCIAL_RAJSRASWATI_JATAV"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200"
                    >
                       <InstagramIcon />
                       <span className="font-semibold">Instagram</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default About;
