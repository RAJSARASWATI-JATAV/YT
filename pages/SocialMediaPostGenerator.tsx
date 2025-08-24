import React, { useState, useCallback } from 'react';
import { generateSocialMediaPost } from '../services/geminiService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const platforms = ["Twitter (X)", "Instagram", "LinkedIn", "Facebook"];
const tones = ["Professional", "Witty", "Inspirational", "Casual", "Excited"];

const SocialMediaPostGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState(platforms[0]);
    const [tone, setTone] = useState(tones[0]);
    const [post, setPost] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState('');

    const handleGeneratePost = useCallback(async () => {
        if (!topic.trim()) {
            setError("Please provide a topic for the social media post.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setPost('');
        setCopySuccess('');

        try {
            const result = await generateSocialMediaPost(platform, topic, tone);
            setPost(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [platform, topic, tone]);

    const handleCopyPost = useCallback(() => {
        if (!post) return;
        navigator.clipboard.writeText(post).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Failed to copy.');
        });
    }, [post]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                    Social Media Post Generator
                </h2>
                <p className="mt-2 text-slate-400">Craft the perfect post for any platform. Just provide the topic and tone.</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700 space-y-4">
                <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-1">Topic / Product</label>
                    <textarea
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., The launch of our new productivity app"
                        className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-y"
                        rows={3}
                        disabled={isLoading}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="platform" className="block text-sm font-medium text-slate-300 mb-1">Platform</label>
                        <select
                            id="platform"
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            disabled={isLoading}
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tone" className="block text-sm font-medium text-slate-300 mb-1">Tone</label>
                         <select
                            id="tone"
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            disabled={isLoading}
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                            {tones.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
                <button
                    onClick={handleGeneratePost}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold py-3 px-6 rounded-md hover:from-blue-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                >
                    {isLoading ? 'Generating Post...' : 'Generate Post'}
                </button>
            </div>

            {error && <ErrorMessage message={error} />}
            {isLoading && <Loader message="The AI is crafting your social media post..." />}

            {post && (
                <div className="bg-slate-800/50 p-6 rounded-lg shadow-inner border border-slate-700 animate-fade-in relative">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-slate-200">Generated Post:</h3>
                         <button
                            onClick={handleCopyPost}
                            className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-bold py-1 px-3 rounded-md transition-colors"
                        >
                            {copySuccess || 'Copy Post'}
                        </button>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-md">
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{post}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SocialMediaPostGenerator;