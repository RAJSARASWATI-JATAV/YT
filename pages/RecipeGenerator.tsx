import React, { useState, useCallback } from 'react';
import { generateRecipe } from '../services/geminiService';
import { Recipe } from '../types';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const RecipeGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateRecipe = useCallback(async () => {
        if (!prompt.trim()) {
            setError("Please enter what you'd like to cook.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setRecipe(null);

        try {
            const result = await generateRecipe(prompt);
            setRecipe(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [prompt]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500">
                    AI Recipe Generator
                </h2>
                <p className="mt-2 text-slate-400">Have some ingredients? Get a delicious, structured recipe in seconds.</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700">
                <div className="flex flex-col md:flex-row gap-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A healthy chicken and avocado salad"
                        className="flex-grow bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition duration-200 resize-y"
                        rows={3}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleGenerateRecipe}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-lime-500 to-green-600 text-white font-bold py-3 px-6 rounded-md hover:from-lime-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                    >
                        {isLoading ? 'Cooking...' : 'Generate Recipe'}
                    </button>
                </div>
            </div>

            {error && <ErrorMessage message={error} />}
            {isLoading && <Loader message="The AI chef is creating your recipe..." />}

            {recipe && (
                <div className="bg-slate-800/50 p-6 rounded-lg shadow-inner border border-slate-700 animate-fade-in space-y-6">
                    <div className="text-center border-b border-slate-700 pb-4">
                         <h3 className="text-2xl font-bold text-green-300">{recipe.recipeName}</h3>
                         <p className="text-slate-400 italic mt-2">{recipe.description}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div><p className="text-sm text-slate-400">Prep Time</p><p className="font-bold text-lg">{recipe.prepTime}</p></div>
                        <div><p className="text-sm text-slate-400">Cook Time</p><p className="font-bold text-lg">{recipe.cookTime}</p></div>
                        <div><p className="text-sm text-slate-400">Total Time</p><p className="font-bold text-lg">{recipe.totalTime}</p></div>
                        <div><p className="text-sm text-slate-400">Servings</p><p className="font-bold text-lg">{recipe.servings}</p></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-700">
                        <div>
                             <h4 className="text-xl font-semibold text-slate-200 mb-3">Ingredients</h4>
                             <ul className="space-y-2">
                                {recipe.ingredients.map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <svg className="w-4 h-4 mr-2 mt-1 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                        <span className="text-slate-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <div>
                            <h4 className="text-xl font-semibold text-slate-200 mb-3">Instructions</h4>
                            <ol className="space-y-3 list-decimal list-inside">
                                {recipe.instructions.map((step, index) => (
                                    <li key={index} className="text-slate-300 leading-relaxed">{step}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeGenerator;
