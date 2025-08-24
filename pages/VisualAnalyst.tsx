import React, { useState, useCallback } from 'react';
import { analyzeImage } from '../services/geminiService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        // remove data:mime/type;base64, part
        resolve(result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
});

const VisualAnalyst: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                setError("Please upload an image smaller than 4MB.");
                return;
            }
            setError(null);
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setResponse('');
        }
    };

    const handleAnalyze = useCallback(async () => {
        if (!imageFile) {
            setError("Please upload an image to analyze.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResponse('');

        try {
            const base64Image = await toBase64(imageFile);
            const userPrompt = prompt.trim() === '' ? "Describe this image in detail." : prompt;
            const result = await analyzeImage(base64Image, imageFile.type, userPrompt);
            setResponse(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [imageFile, prompt]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500">
                    AI Visual Analyst
                </h2>
                <p className="mt-2 text-slate-400">Upload an image and ask a question, or get a detailed description.</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700 space-y-4">
                <div>
                    <label htmlFor="image-upload" className="block text-sm font-medium text-slate-300 mb-2">Upload Image (Max 4MB)</label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-900/50 file:text-rose-300 hover:file:bg-rose-900"
                        disabled={isLoading}
                    />
                </div>
                 {imagePreview && (
                    <div className="flex justify-center max-h-80 p-2 bg-slate-900/50 rounded-md">
                        <img src={imagePreview} alt="Upload preview" className="object-contain rounded" />
                    </div>
                )}
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask a question about the image (optional)..."
                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition duration-200 resize-y"
                    rows={2}
                    disabled={isLoading || !imageFile}
                />
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading || !imageFile}
                    className="w-full bg-gradient-to-r from-rose-600 to-red-500 text-white font-bold py-3 px-6 rounded-md hover:from-rose-700 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                >
                    {isLoading ? 'Analyzing...' : 'Analyze Image'}
                </button>
            </div>

            {error && <ErrorMessage message={error} />}
            {isLoading && <Loader message="The AI is examining your image..." />}

            {response && (
                <div className="bg-slate-800/50 p-6 rounded-lg shadow-inner border border-slate-700 animate-fade-in">
                    <h3 className="text-xl font-bold mb-4 text-slate-200">Analysis Result:</h3>
                    <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{response}</p>
                </div>
            )}
        </div>
    );
};

export default VisualAnalyst;
