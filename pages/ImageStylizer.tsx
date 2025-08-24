import React, { useState, useCallback } from 'react';
import { stylizeImage } from '../services/geminiService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
});

const styles = [
    "Impressionist Painting",
    "Cyberpunk Art",
    "Anime / Manga",
    "Vintage Film Photography",
    "Watercolor Painting",
    "Abstract Expressionism",
    "Pop Art",
    "Steampunk",
];

const ImageStylizer: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [stylizedImage, setStylizedImage] = useState<string | null>(null);
    const [selectedStyle, setSelectedStyle] = useState(styles[0]);
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
            setOriginalImage(URL.createObjectURL(file));
            setStylizedImage(null);
        }
    };
    
    const handleStylize = useCallback(async () => {
        if (!imageFile) {
            setError("Please upload an image to stylize.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setStylizedImage(null);

        try {
            const base64Image = await toBase64(imageFile);
            const result = await stylizeImage(base64Image, imageFile.type, selectedStyle);
            setStylizedImage(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [imageFile, selectedStyle]);

     const handleReset = () => {
        setImageFile(null);
        setOriginalImage(null);
        setStylizedImage(null);
        setError(null);
        setIsLoading(false);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">
                    AI Image Stylizer
                </h2>
                <p className="mt-2 text-slate-400">Transform your photos into works of art. Upload an image and choose a style.</p>
            </div>
            
            {!stylizedImage && (
                <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700 space-y-4">
                    <div>
                        <label htmlFor="image-upload" className="block text-sm font-medium text-slate-300 mb-2">1. Upload Image (Max 4MB)</label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-900/50 file:text-fuchsia-300 hover:file:bg-fuchsia-900"
                            disabled={isLoading}
                        />
                    </div>
                    {originalImage && (
                        <>
                            <div className="flex justify-center max-h-60 p-2 bg-slate-900/50 rounded-md">
                                <img src={originalImage} alt="Upload preview" className="object-contain rounded" />
                            </div>
                            <div>
                                <label htmlFor="style-select" className="block text-sm font-medium text-slate-300 mb-2">2. Choose a Style</label>
                                <select
                                    id="style-select"
                                    value={selectedStyle}
                                    onChange={(e) => setSelectedStyle(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition duration-200"
                                >
                                    {styles.map(style => <option key={style} value={style}>{style}</option>)}
                                </select>
                            </div>
                            <button
                                onClick={handleStylize}
                                disabled={isLoading || !imageFile}
                                className="w-full bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-bold py-3 px-6 rounded-md hover:from-fuchsia-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                            >
                                {isLoading ? 'Stylizing...' : 'Stylize Image'}
                            </button>
                        </>
                    )}
                </div>
            )}

            {error && <ErrorMessage message={error} />}
            {isLoading && <Loader message="AI is analyzing your image and applying the artistic style..." />}

            {stylizedImage && originalImage && (
                <div className="animate-fade-in space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-4 rounded-lg shadow-inner border border-slate-700">
                            <h3 className="text-lg font-bold text-slate-300 mb-2 text-center">Original</h3>
                            <img src={originalImage} alt="Original upload" className="rounded-md w-full object-contain" />
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg shadow-inner border border-slate-700">
                            <h3 className="text-lg font-bold text-slate-300 mb-2 text-center">Stylized ({selectedStyle})</h3>
                            <img src={stylizedImage} alt={`Stylized in ${selectedStyle}`} className="rounded-md w-full object-contain" />
                        </div>
                    </div>
                    <div className="text-center flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button onClick={handleReset} className="bg-slate-600 text-white font-bold py-2 px-5 rounded-md hover:bg-slate-700 transition-all w-full sm:w-auto">
                           Start Over
                        </button>
                        <a
                            href={stylizedImage}
                            download={`stylized-${selectedStyle.toLowerCase().replace(/\s/g, '-')}.jpg`}
                            className="bg-gradient-to-r from-green-500 to-cyan-600 text-white font-bold py-2 px-5 rounded-md hover:from-green-600 hover:to-cyan-700 transition-all w-full sm:w-auto text-center"
                        >
                            Download Stylized Image
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageStylizer;