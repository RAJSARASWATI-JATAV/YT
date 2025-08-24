
import React, { useState, useCallback } from 'react';
import { generateStoryStream } from '../services/geminiService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const StoryWriter: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [story, setStory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateStory = useCallback(async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt for your story.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setStory('');

        try {
            await generateStoryStream(prompt, (chunk) => {
                setStory((prev) => prev + chunk);
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [prompt]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                    AI Story Writer
                </h2>
                <p className="mt-2 text-slate-400">Unleash your imagination. Provide a prompt and watch a story unfold in real-time.</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700">
                <div className="flex flex-col md:flex-row gap-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A lone astronaut discovers a mysterious signal from an uncharted moon..."
                        className="flex-grow bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none h-24 md:h-auto"
                        rows={3}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleGenerateStory}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-3 px-6 rounded-md hover:from-indigo-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-px"
                    >
                        {isLoading ? 'Weaving Tale...' : 'Generate Story'}
                    </button>
                </div>
            </div>

            {error && <ErrorMessage message={error} />}
            
            {isLoading && !story && <Loader message="The AI is pondering your prompt..." />}

            {story && (
                <div className="bg-slate-800/50 p-6 rounded-lg shadow-inner border border-slate-700 animate-fade-in">
                    <h3 className="text-xl font-bold mb-4 text-slate-200 border-b border-slate-600 pb-2">Your Generated Story:</h3>
                    <div 
                        className="prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-100 whitespace-pre-wrap font-serif text-lg leading-relaxed"
                    >
                        {story}
                        {isLoading && <span className="inline-block w-2 h-5 bg-cyan-400 ml-1 animate-pulse"></span>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryWriter;
