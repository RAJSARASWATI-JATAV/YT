import React, { useState, useCallback, useEffect, useRef } from 'react';
import { startVideoGeneration, getVideosOperation } from '../services/geminiService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const loadingMessages = [
    "Warming up the virtual cameras...",
    "Director is reviewing the script...",
    "Action! Filming the first scene...",
    "This can take a few minutes, please be patient...",
    "Processing the raw footage...",
    "Adding dazzling special effects...",
    "Finalizing the sound design...",
    "Almost there, wrapping up the production...",
];

const VideoGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [operation, setOperation] = useState<any | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

    const pollIntervalRef = useRef<number | null>(null);

    const handleGenerateVideo = useCallback(async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt for your video.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setOperation(null);
        setVideoUrl(null);

        try {
            const initialOperation = await startVideoGeneration(prompt);
            setOperation(initialOperation);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setIsLoading(false);
        }
    }, [prompt]);

    const pollOperation = useCallback(async (op: any) => {
        try {
            const result = await getVideosOperation(op);
            if (result.done) {
                const uri = result.response?.generatedVideos?.[0]?.video?.uri;
                if (uri) {
                    const response = await fetch(`${uri}&key=${process.env.API_KEY}`);
                    const blob = await response.blob();
                    setVideoUrl(URL.createObjectURL(blob));
                } else {
                     setError("Video generation finished, but no video URL was found.");
                }
                setIsLoading(false);
                setOperation(null);
            } else {
                setOperation(result);
                 pollIntervalRef.current = window.setTimeout(() => pollOperation(result), 10000);
            }
        } catch (err) {
             setError(err instanceof Error ? err.message : 'An error occurred while checking video status.');
             setIsLoading(false);
             setOperation(null);
        }
    }, []);

    useEffect(() => {
        if (operation && !operation.done) {
            pollIntervalRef.current = window.setTimeout(() => pollOperation(operation), 10000);
        }
        return () => {
            if (pollIntervalRef.current) {
                clearTimeout(pollIntervalRef.current);
            }
        };
    }, [operation, pollOperation]);

    useEffect(() => {
        let messageInterval: number;
        if (isLoading) {
            let index = 0;
            setLoadingMessage(loadingMessages[index]);
            messageInterval = window.setInterval(() => {
                index = (index + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[index]);
            }, 4000);
        }
        return () => clearInterval(messageInterval);
    }, [isLoading]);
    
    const handleReset = () => {
        setPrompt('');
        setIsLoading(false);
        setError(null);
        setOperation(null);
        setVideoUrl(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
                    AI Video Generator
                </h2>
                <p className="mt-2 text-slate-400">Bring your ideas to motion. Describe a scene and generate a short video.</p>
            </div>

            {!videoUrl && (
                 <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700">
                    <div className="flex flex-col md:flex-row gap-4">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., A time-lapse of a futuristic city being built, with flying cars and neon lights..."
                            className="flex-grow bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 resize-y h-24 md:h-auto"
                            rows={3}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleGenerateVideo}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-3 px-6 rounded-md hover:from-red-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                        >
                            {isLoading ? 'Generating...' : 'Generate Video'}
                        </button>
                    </div>
                </div>
            )}

            {error && <ErrorMessage message={error} />}
            {isLoading && <Loader message={loadingMessage} />}

            {videoUrl && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-slate-800/50 p-4 rounded-lg shadow-inner border border-slate-700">
                        <h3 className="text-xl font-bold text-slate-200 mb-4">Your Generated Video:</h3>
                        <video src={videoUrl} controls autoPlay muted loop className="rounded-md w-full" />
                    </div>
                     <div className="text-center flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button onClick={handleReset} className="bg-slate-600 text-white font-bold py-2 px-5 rounded-md hover:bg-slate-700 transition-all w-full sm:w-auto">
                           Generate Another Video
                        </button>
                        <a
                            href={videoUrl}
                            download="gemini-generated-video.mp4"
                            className="bg-gradient-to-r from-green-500 to-cyan-600 text-white font-bold py-2 px-5 rounded-md hover:from-green-600 hover:to-cyan-700 transition-all w-full sm:w-auto text-center"
                        >
                            Download Video
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoGenerator;