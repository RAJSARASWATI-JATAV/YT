import React, { useState, useCallback } from 'react';
import { analyzeDocument } from '../services/geminiService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

type AnalysisMode = 'summarize' | 'extract' | 'qa';

const modeLabels: Record<AnalysisMode, string> = {
    summarize: 'Summarize',
    extract: 'Extract Key Points',
    qa: 'Ask a Question',
};

const DocumentAnalyst: React.FC = () => {
    const [documentText, setDocumentText] = useState('');
    const [mode, setMode] = useState<AnalysisMode>('summarize');
    const [question, setQuestion] = useState('');
    const [analysisResult, setAnalysisResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'text/plain') {
                setError('Please upload a valid .txt file.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                setDocumentText(event.target?.result as string);
                setError(null);
            };
            reader.readAsText(file);
        }
    };

    const handleAnalyze = useCallback(async () => {
        if (!documentText.trim()) {
            setError("Please provide some text to analyze.");
            return;
        }
        if (mode === 'qa' && !question.trim()) {
            setError("Please enter a question to ask about the document.");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setAnalysisResult('');
        setCopySuccess('');

        try {
            const result = await analyzeDocument(documentText, mode, question);
            setAnalysisResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [documentText, mode, question]);

    const handleCopyResult = useCallback(() => {
        if (!analysisResult) return;
        navigator.clipboard.writeText(analysisResult).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Failed to copy.');
        });
    }, [analysisResult]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-gray-500">
                    AI Document Analyst
                </h2>
                <p className="mt-2 text-slate-400">Paste text or upload a document to summarize, extract key points, or ask questions.</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700 space-y-4">
                <div className="space-y-2">
                    <p className="text-sm text-slate-300">Paste your text below or upload a .txt file.</p>
                     <textarea
                        value={documentText}
                        onChange={(e) => setDocumentText(e.target.value)}
                        placeholder="Paste your document text here..."
                        className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition duration-200 resize-y"
                        rows={10}
                        disabled={isLoading}
                    />
                    <div>
                        <label htmlFor="text-upload" className="sr-only">Upload .txt File</label>
                        <input
                            id="text-upload"
                            type="file"
                            accept=".txt"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-slate-300 hover:file:bg-slate-600"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="border-t border-slate-700 pt-4 space-y-2">
                    <h3 className="text-lg font-semibold text-slate-200">Analysis Mode</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {(Object.keys(modeLabels) as AnalysisMode[]).map(m => (
                            <label key={m} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="mode"
                                    value={m}
                                    checked={mode === m}
                                    onChange={() => setMode(m)}
                                    className="h-4 w-4 text-indigo-500 bg-slate-700 border-slate-600 focus:ring-indigo-500"
                                    disabled={isLoading}
                                />
                                <span className="text-slate-300">{modeLabels[m]}</span>
                            </label>
                        ))}
                    </div>
                </div>
                
                 {mode === 'qa' && (
                    <div className="animate-fade-in">
                        <label htmlFor="question" className="block text-sm font-medium text-slate-300 mb-1">Your Question</label>
                        <input
                            id="question"
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="e.g., What was the main conclusion of the report?"
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            disabled={isLoading}
                        />
                    </div>
                )}
                
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-slate-500 text-white font-bold py-3 px-6 rounded-md hover:from-indigo-700 hover:to-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                >
                    {isLoading ? 'Analyzing...' : 'Analyze Document'}
                </button>
            </div>

            {error && <ErrorMessage message={error} />}
            {isLoading && <Loader message="The AI is analyzing the document..." />}

            {analysisResult && (
                <div className="bg-slate-800/50 p-6 rounded-lg shadow-inner border border-slate-700 animate-fade-in relative">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-slate-200">Analysis Result:</h3>
                         <button
                            onClick={handleCopyResult}
                            className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-bold py-1 px-3 rounded-md transition-colors"
                        >
                            {copySuccess || 'Copy Result'}
                        </button>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-md">
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{analysisResult}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentAnalyst;