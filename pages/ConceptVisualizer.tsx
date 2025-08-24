
import React, { useState, useCallback } from 'react';
import { generateText, generateImages } from '../services/geminiService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

type Stage = 'prompt' | 'describing' | 'description' | 'imaging' | 'done';

const ConceptVisualizer: React.FC = () => {
    const [concept, setConcept] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [stage, setStage] = useState<Stage>('prompt');
    const [error, setError] = useState<string | null>(null);
    
    const startVisualization = useCallback(async () => {
        if (!concept.trim()) {
            setError("Please enter a concept to visualize.");
            return;
        }
        setError(null);
        setStage('describing');
        setDescription('');
        setImage(null);

        try {
            const prompt = `Create a highly detailed, vivid, and artistic description of the following concept. Focus on visual elements, colors, textures, lighting, and atmosphere. This description will be used as a prompt for an AI image generator. Concept: "${concept}"`;
            const generatedDescription = await generateText(prompt);
            setDescription(generatedDescription);
            setStage('description');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate description.');
            setStage('prompt');
        }
    }, [concept]);
    
    const generateImageFromDescription = useCallback(async () => {
        setStage('imaging');
        setError(null);
        try {
            const images = await generateImages(description, "16:9");
            if (images.length > 0) {
                setImage(images[0]);
            }
            setStage('done');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate image.');
            setStage('description');
        }
    }, [description]);

    const handleReset = () => {
        setConcept('');
        setDescription('');
        setImage(null);
        setError(null);
        setStage('prompt');
    };

    const isLoading = stage === 'describing' || stage === 'imaging';

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                    Concept Visualizer
                </h2>
                <p className="mt-2 text-slate-400">From a simple idea to a detailed vision. First we describe, then we visualize.</p>
            </div>
            
            {stage === 'prompt' && (
                <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            value={concept}
                            onChange={(e) => setConcept(e.target.value)}
                            placeholder="e.g., A city where nature and technology coexist"
                            className="flex-grow bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
                            disabled={isLoading}
                        />
                        <button onClick={startVisualization} disabled={isLoading} className="bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold py-3 px-6 rounded-md hover:from-teal-600 hover:to-blue-600 disabled:opacity-50 transition-all shadow-md">
                            Start Visualization
                        </button>
                    </div>
                </div>
            )}
            
            {error && <ErrorMessage message={error} />}
            {stage === 'describing' && <Loader message="AI is brainstorming a detailed description..." />}

            {(stage === 'description' || stage === 'imaging' || stage === 'done') && (
                <div className="bg-slate-800/50 p-6 rounded-lg shadow-inner border border-slate-700 space-y-4 animate-fade-in">
                    <h3 className="text-xl font-bold text-slate-200">Generated Description:</h3>
                    <p className="text-slate-300 whitespace-pre-wrap">{description}</p>
                    {stage === 'description' && (
                        <button onClick={generateImageFromDescription} className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-2 px-5 rounded-md hover:from-purple-700 hover:to-pink-600 transition-all shadow-md">
                           Now, Generate Image
                        </button>
                    )}
                </div>
            )}
            
            {stage === 'imaging' && <Loader message="The AI is now creating the visual from the description..." />}
            
            {image && (
                <div className="bg-slate-800/50 p-4 rounded-lg shadow-inner border border-slate-700 animate-fade-in">
                    <h3 className="text-xl font-bold text-slate-200 mb-4">Final Visualization:</h3>
                    <img src={image} alt={`Visualization of ${concept}`} className="rounded-md w-full" />
                </div>
            )}
            
            {(stage === 'done' || (stage === 'description' && error)) && (
                <div className="text-center">
                    <button onClick={handleReset} className="bg-slate-600 text-white font-bold py-2 px-5 rounded-md hover:bg-slate-700 transition-all">
                        Start a New Visualization
                    </button>
                </div>
            )}
        </div>
    );
};

export default ConceptVisualizer;
