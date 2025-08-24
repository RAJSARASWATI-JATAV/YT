import React from 'react';
import { CreativeTool } from '../types';
import { BrainCircuit, Image as ImageIcon, Sparkles, Megaphone, Search } from 'lucide-react';

// Using lucide-react for icons, will define them as components for this setup
const iconMap: { [key in CreativeTool]: React.ElementType } = {
    [CreativeTool.StoryWriter]: ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>,
    [CreativeTool.ImageGenerator]: ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>,
    [CreativeTool.ImageStylizer]: ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 20h.01"/><path d="M10 20v-2.5c0-.8.4-1.5 1-2 .6-.5 1.4-1 2-1s1.4.5 2 1c.6.5 1 1.2 1 2V20"/><path d="m4.3 15.3 1.8-1.7a2 2 0 0 1 2.8 0L12 17l-1.9 1.9a2 2 0 0 1-2.8 0l-1.8-1.8a2 2 0 0 1 0-2.8Z"/><path d="m15.3 4.3 1.8 1.8a2 2 0 0 1 0 2.8l-1.8 1.8a2 2 0 0 1-2.8 0L11 8l1.9-1.9a2 2 0 0 1 2.8 0Z"/></svg>,
    [CreativeTool.ConceptVisualizer]: ({ className }: { className:string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z"/><path d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/><path d="M12 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/><path d="M18 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/><path d="M6 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/></svg>,
    [CreativeTool.SloganGenerator]: ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/></svg>,
    [CreativeTool.ResearchAssistant]: ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
    [CreativeTool.VideoGenerator]: ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>,
    [CreativeTool.ChatPersona]: ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    [CreativeTool.RecipeGenerator]: ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z"/></svg>,
    [CreativeTool.EmailWriter]: ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
    [CreativeTool.WorkoutPlanner]: ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
    [CreativeTool.MealPlanner]: ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12h18"></path><path d="M3 6h18"></path><path d="M3 18h18"></path><path d="M12 3v18"></path></svg>,
    [CreativeTool.SocialMediaPostGenerator]: ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m2 22 7.2-1.4c.9-.2 1.8-.6 2.5-1.3l8.5-8.5c.8-.8.8-2 0-2.8l-3.7-3.7c-.8-.8-2-.8-2.8 0L5.2 12c-.6.7-1 1.6-1.2 2.5L2 22Z"/><path d="m21.7 2.3-1.4-1.4"/></svg>,
    [CreativeTool.VisualAnalyst]: ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
    [CreativeTool.CodeAssistant]: ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    [CreativeTool.DocumentAnalyst]: ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" x2="12" y1="18" y2="12"/><line x1="9" x2="15" y1="15" y2="15"/></svg>,
    [CreativeTool.TripPlanner]: ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>,
    [CreativeTool.ModelComparisonHub]: ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 10H4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2Z"/><path d="m20 14-3-3-3 3"/><path d="M14 10V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2Z"/></svg>,
    [CreativeTool.PromptLibrary]: ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    [CreativeTool.About]: ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
};


interface HeaderProps {
    activeTool: CreativeTool;
    onToolChange: (tool: CreativeTool) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTool, onToolChange }) => {
    const tools = Object.values(CreativeTool);

    return (
        <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <svg className="h-8 w-8 text-indigo-400 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .9C5.88.9.9 5.88.9 12s4.98 11.1 11.1 11.1 11.1-4.98 11.1-11.1S18.12.9 12 .9zm0 20.32c-5.09 0-9.22-4.13-9.22-9.22S6.91 2.78 12 2.78s9.22 4.13 9.22 9.22-4.13 9.22-9.22 9.22z"/><path d="M12 6.5c-3.03 0-5.5 2.47-5.5 5.5s2.47 5.5 5.5 5.5 5.5-2.47 5.5-5.5-2.47-5.5-5.5-5.5zm0 9c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
                        <h1 className="text-xl font-bold text-slate-100">Gemini Creative Suite</h1>
                    </div>
                </div>
            </div>
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto py-2">
                    {tools.map(tool => {
                        const Icon = iconMap[tool];
                        const isActive = activeTool === tool;
                        return (
                            <button
                                key={tool}
                                onClick={() => onToolChange(tool)}
                                className={`flex items-center space-x-2 px-3 py-2 text-sm sm:text-base font-medium rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 whitespace-nowrap ${
                                    isActive
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{tool}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </header>
    );
};

export default Header;