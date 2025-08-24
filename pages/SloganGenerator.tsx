
import React, { useState, useCallback } from 'react';
import { generateText } from '../services/geminiService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const SloganGenerator: React.FC = () => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [slogans, setSlogans] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateSlogans = useCallback(async () => {
        if (!productName.trim() || !description.trim()) {
            setError("Please provide both a product name and description.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setSlogans([]);

        try {
            const prompt = `Generate 5 catchy and memorable slogans for a product named "${productName}". The product is described as: "${description}". Return the slogans as a simple list separated by newlines.`;
            const systemInstruction = "You are a witty and creative marketing expert specializing in brand slogans.";
            const resultText = await generateText(prompt, systemInstruction);
            setSlogans(resultText.split('\n').filter(s => s.trim() !== ''));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [productName, description]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                    AI Slogan Generator
                </h2>
                <p className="mt-2 text-slate-400">Craft the perfect tagline for your brand in seconds.</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700 space-y-4">
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Product Name (e.g., 'Nova Coffee')"
                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200"
                    disabled={isLoading}
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Product Description (e.g., 'Sustainably sourced, high-altitude arabica beans...')"
                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200 resize-y"
                    rows={3}
                    disabled={isLoading}
                />
                <button
                    onClick={handleGenerateSlogans}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 px-6 rounded-md hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                >
                    {isLoading ? 'Brainstorming...' : 'Generate Slogans'}
                </button>
            </div>

            {error && <ErrorMessage message={error} />}
            {isLoading && <Loader message="The AI is crafting catchy slogans..." />}

            {slogans.length > 0 && (
                <div className="bg-slate-800/50 p-6 rounded-lg shadow-inner border border-slate-700 animate-fade-in">
                    <h3 className="text-xl font-bold mb-4 text-slate-200">Generated Slogans:</h3>
                    <ul className="space-y-3">
                        {slogans.map((slogan, index) => (
                            <li key={index} className="bg-slate-700/50 p-3 rounded-md text-slate-300 italic">
                                "{slogan.replace(/^- /, '')}"
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SloganGenerator;
