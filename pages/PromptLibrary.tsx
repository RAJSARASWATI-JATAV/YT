import React, { useState, useEffect, useCallback } from 'react';
import { SavedPrompt } from '../types';

const STORAGE_KEY = 'gemini-prompt-library';

const PromptLibrary: React.FC = () => {
    const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [newPrompt, setNewPrompt] = useState('');
    const [copySuccessId, setCopySuccessId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const savedPrompts = localStorage.getItem(STORAGE_KEY);
            if (savedPrompts) {
                setPrompts(JSON.parse(savedPrompts));
            }
        } catch (err) {
            console.error("Failed to load prompts from local storage", err);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
        } catch (err) {
            console.error("Failed to save prompts to local storage", err);
        }
    }, [prompts]);

    const handleAddPrompt = useCallback(() => {
        if (!newTitle.trim() || !newPrompt.trim()) {
            setError("Both title and prompt text are required.");
            return;
        }
        const newSavedPrompt: SavedPrompt = {
            id: Date.now().toString(),
            title: newTitle,
            prompt: newPrompt,
        };
        setPrompts(prev => [newSavedPrompt, ...prev]);
        setNewTitle('');
        setNewPrompt('');
        setError(null);
    }, [newTitle, newPrompt]);

    const handleDeletePrompt = useCallback((id: string) => {
        setPrompts(prev => prev.filter(p => p.id !== id));
    }, []);

    const handleCopyPrompt = useCallback((promptText: string, id: string) => {
        navigator.clipboard.writeText(promptText).then(() => {
            setCopySuccessId(id);
            setTimeout(() => setCopySuccessId(null), 2000);
        });
    }, []);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                    Prompt Library
                </h2>
                <p className="mt-2 text-slate-400">Save your favorite prompts and reuse them across any tool.</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700 space-y-4">
                <h3 className="text-xl font-bold text-slate-200">Add New Prompt</h3>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Prompt Title (e.g., 'Cyberpunk City Description')"
                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-yellow-500"
                />
                <textarea
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    placeholder="Enter your prompt text here..."
                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-yellow-500 resize-y"
                    rows={4}
                />
                <button
                    onClick={handleAddPrompt}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 px-6 rounded-md hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 transition-all shadow-md"
                >
                    Save to Library
                </button>
            </div>

            <div className="space-y-4">
                 <h3 className="text-2xl font-bold text-slate-200 border-b border-slate-700 pb-2">Your Saved Prompts</h3>
                 {prompts.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">Your library is empty. Add a prompt above to get started!</p>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {prompts.map(p => (
                            <div key={p.id} className="bg-slate-800/50 p-4 rounded-lg shadow-md border border-slate-700 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-bold text-lg text-orange-300 mb-2 truncate">{p.title}</h4>
                                    <p className="text-slate-300 text-sm line-clamp-4 whitespace-pre-wrap">{p.prompt}</p>
                                </div>
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700">
                                    <button
                                        onClick={() => handleCopyPrompt(p.prompt, p.id)}
                                        className="flex-grow bg-slate-600 hover:bg-slate-500 text-white text-sm font-bold py-2 px-3 rounded-md transition-colors"
                                    >
                                        {copySuccessId === p.id ? 'Copied!' : 'Copy'}
                                    </button>
                                    <button
                                        onClick={() => handleDeletePrompt(p.id)}
                                        className="bg-red-900/50 hover:bg-red-900 text-red-300 text-sm font-bold py-2 px-3 rounded-md transition-colors"
                                        aria-label="Delete prompt"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                 )}
            </div>
        </div>
    );
};

export default PromptLibrary;