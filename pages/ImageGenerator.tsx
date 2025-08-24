
import React, { useState, useCallback } from 'react';
import { generateImages } from '../services/geminiService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateImages = useCallback(async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt to generate an image.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setImages([]);

        try {
            const result = await generateImages(prompt, aspectRatio);
            setImages(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [prompt, aspectRatio]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    AI Image Generator
                </h2>
                <p className="mt-2 text-slate-400">Describe anything you can imagine, and watch it come to life as a vivid image.</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700">
                <div className="space-y-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., An astronaut riding a majestic cosmic whale through a nebula, cinematic lighting..."
                        className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 resize-y"
                        rows={3}
                        disabled={isLoading}
                    />
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                         <div className="w-full sm:w-auto">
                            <label htmlFor="aspect-ratio" className="block text-sm font-medium text-slate-300 mb-1">Aspect Ratio</label>
                            <select
                                id="aspect-ratio"
                                value={aspectRatio}
                                onChange={(e) => setAspectRatio(e.target.value)}
                                disabled={isLoading}
                                className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                            >
                                {aspectRatios.map(ar => <option key={ar} value={ar}>{ar}</option>)}
                            </select>
                        </div>
                        <button
                            onClick={handleGenerateImages}
                            disabled={isLoading}
                            className="w-full sm:w-auto mt-4 sm:mt-0 sm:self-end bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 px-8 rounded-md hover:from-purple-700 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-px"
                        >
                            {isLoading ? 'Creating...' : 'Generate Image'}
                        </button>
                    </div>
                </div>
            </div>

            {error && <ErrorMessage message={error} />}
            
            {isLoading && <Loader message="The AI is painting your masterpiece..." />}

            {images.length > 0 && (
                <div className="grid grid-cols-1 gap-6 pt-4 animate-fade-in">
                    {images.map((src, index) => (
                        <div key={index} className="bg-slate-800/50 p-4 rounded-lg shadow-inner border border-slate-700">
                            <img src={src} alt={`Generated art for: ${prompt}`} className="rounded-md w-full object-contain" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageGenerator;
