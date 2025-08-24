
import React, { useState, useCallback } from 'react';
import { researchWithGoogle } from '../services/geminiService';
import { ResearchResult } from '../types';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const ResearchAssistant: React.FC = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<ResearchResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleResearch = useCallback(async () => {
        if (!query.trim()) {
            setError("Please enter a research query.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const researchResult = await researchWithGoogle(query);
            setResult(researchResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [query]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500">
                    AI Research Assistant
                </h2>
                <p className="mt-2 text-slate-400">Ask questions about recent events or topics and get answers grounded in Google Search.</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700">
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., What were the main announcements at the latest tech conference?"
                        className="flex-grow bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                        disabled={isLoading}
                        onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleResearch()}
                    />
                    <button
                        onClick={handleResearch}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-green-500 to-cyan-600 text-white font-bold py-3 px-6 rounded-md hover:from-green-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                    >
                        {isLoading ? 'Researching...' : 'Get Answer'}
                    </button>
                </div>
            </div>

            {error && <ErrorMessage message={error} />}
            {isLoading && <Loader message="Searching the web and synthesizing an answer..." />}

            {result && (
                <div className="bg-slate-800/50 p-6 rounded-lg shadow-inner border border-slate-700 space-y-6 animate-fade-in">
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-slate-200">Answer:</h3>
                        <p className="text-slate-300 whitespace-pre-wrap">{result.text}</p>
                    </div>
                    {result.sources.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold mb-3 text-slate-200 border-t border-slate-700 pt-4">
                                Sources:
                            </h3>
                            <ul className="space-y-2">
                                {result.sources.map((source, index) => (
                                    <li key={index}>
                                        <a
                                            href={source.uri}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors break-all"
                                        >
                                            {index + 1}. {source.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResearchAssistant;
