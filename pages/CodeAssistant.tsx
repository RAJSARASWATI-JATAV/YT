import React, { useState, useCallback } from 'react';
import { generateCode, debugCode } from '../services/geminiService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

type Mode = 'generate' | 'debug';
const languages = ["Python", "JavaScript", "Java", "C++", "HTML", "CSS", "SQL", "TypeScript", "Go"];

const CodeAssistant: React.FC = () => {
    const [mode, setMode] = useState<Mode>('generate');
    const [language, setLanguage] = useState('Python');
    const [description, setDescription] = useState('');
    const [codeToDebug, setCodeToDebug] = useState('');
    const [errorDescription, setErrorDescription] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState('');

    const handleGenerate = useCallback(async () => {
        if (mode === 'generate') {
            if (!description.trim()) {
                setError("Please provide a description of the code you want to generate.");
                return;
            }
        } else { // debug mode
            if (!codeToDebug.trim() || !errorDescription.trim()) {
                setError("Please provide both the code and a description of the error.");
                return;
            }
        }

        setIsLoading(true);
        setError(null);
        setResult('');
        setCopySuccess('');

        try {
            let apiResult;
            if (mode === 'generate') {
                apiResult = await generateCode(language, description);
            } else {
                apiResult = await debugCode(language, codeToDebug, errorDescription);
            }
            setResult(apiResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [mode, language, description, codeToDebug, errorDescription]);

    const handleCopyCode = useCallback(() => {
        if (!result) return;
        let textToCopy = result;
        if (mode === 'debug') {
            const match = result.match(/Corrected Code:[\s\S]*/);
            if (match) {
                 const codeBlock = match[0].replace('Corrected Code:', '').trim();
                 // Heuristic to remove markdown fences if they exist
                 textToCopy = codeBlock.replace(/^```[a-z]*\n|```$/g, '');
            }
        }
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Failed to copy.');
        });
    }, [result, mode]);
    
    const renderGeneratorForm = () => (
         <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., A Python function to fetch data from an API and handle errors"
            className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 resize-y"
            rows={8}
            disabled={isLoading}
        />
    );
    
    const renderDebuggerForm = () => (
        <div className="space-y-4">
            <textarea
                value={codeToDebug}
                onChange={(e) => setCodeToDebug(e.target.value)}
                placeholder={`Paste your ${language} code here...`}
                className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 resize-y font-mono"
                rows={10}
                disabled={isLoading}
            />
            <textarea
                value={errorDescription}
                onChange={(e) => setErrorDescription(e.target.value)}
                placeholder="Describe the error or what's not working as expected..."
                className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 resize-y"
                rows={3}
                disabled={isLoading}
            />
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-yellow-300">
                    AI Code Assistant
                </h2>
                <p className="mt-2 text-slate-400">Generate new code or debug existing snippets with AI assistance.</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700 space-y-4">
                 <div className="flex justify-center bg-slate-900/50 p-1 rounded-lg">
                    <button onClick={() => setMode('generate')} className={`px-4 py-2 text-sm font-semibold rounded-md w-1/2 transition-colors ${mode === 'generate' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Generate</button>
                    <button onClick={() => setMode('debug')} className={`px-4 py-2 text-sm font-semibold rounded-md w-1/2 transition-colors ${mode === 'debug' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Debug</button>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                           {mode === 'generate' ? 'Code Description' : 'Code & Error Description'}
                        </label>
                        {mode === 'generate' ? renderGeneratorForm() : renderDebuggerForm()}
                    </div>
                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-slate-300 mb-2">Language</label>
                        <select
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            disabled={isLoading}
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200"
                        >
                            {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                        </select>
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-6 rounded-md hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                >
                    {isLoading ? (mode === 'generate' ? 'Writing Code...' : 'Debugging...') : (mode === 'generate' ? 'Generate Code' : 'Debug Code')}
                </button>
            </div>

            {error && <ErrorMessage message={error} />}
            {isLoading && <Loader message={mode === 'generate' ? 'The AI is compiling your code...' : 'The AI is analyzing the bug...'} />}

            {result && (
                <div className="bg-slate-900 p-4 rounded-lg shadow-inner border border-slate-700 animate-fade-in relative">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-slate-200">{mode === 'generate' ? `${language} Code Snippet:` : 'Debugging Analysis:'}</h3>
                        <button
                            onClick={handleCopyCode}
                            className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-bold py-1 px-3 rounded-md transition-colors"
                        >
                            {copySuccess || (mode === 'debug' ? 'Copy Fix' : 'Copy Code')}
                        </button>
                    </div>
                    <pre className="bg-black/50 p-4 rounded-md overflow-x-auto">
                        <code className="text-slate-300 whitespace-pre-wrap font-mono text-sm">
                            {result}
                        </code>
                    </pre>
                </div>
            )}
        </div>
    );
};

export default CodeAssistant;