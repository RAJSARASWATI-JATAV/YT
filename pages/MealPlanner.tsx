import React, { useState, useCallback } from 'react';
import { generateMealPlan } from '../services/geminiService';
import { MealPlan } from '../types';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const diets = ["Anything", "Vegetarian", "Vegan", "Low-Carb", "Paleo"];

const MealPlanner: React.FC = () => {
    const [diet, setDiet] = useState(diets[0]);
    const [calories, setCalories] = useState(2000);
    const [days, setDays] = useState(3);
    const [plan, setPlan] = useState<MealPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePlan = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setPlan(null);

        try {
            const result = await generateMealPlan(diet, calories, days);
            setPlan(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [diet, calories, days]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-400">
                    AI Meal Planner
                </h2>
                <p className="mt-2 text-slate-400">Generate a personalized meal plan with a full grocery list.</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="diet" className="block text-sm font-medium text-slate-300 mb-1">Dietary Preference</label>
                        <select id="diet" value={diet} onChange={e => setDiet(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-green-500" disabled={isLoading}>
                            {diets.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="calories" className="block text-sm font-medium text-slate-300 mb-1">Daily Calories</label>
                        <input id="calories" type="number" value={calories} onChange={e => setCalories(parseInt(e.target.value, 10))} step="100" min="1200" className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-green-500" disabled={isLoading} />
                    </div>
                    <div>
                        <label htmlFor="days" className="block text-sm font-medium text-slate-300 mb-1">Number of Days</label>
                        <input id="days" type="number" value={days} onChange={e => setDays(parseInt(e.target.value, 10))} min="1" max="7" className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-green-500" disabled={isLoading} />
                    </div>
                </div>
                <button onClick={handleGeneratePlan} disabled={isLoading} className="w-full bg-gradient-to-r from-green-500 to-lime-500 text-white font-bold py-3 px-6 rounded-md hover:from-green-600 hover:to-lime-600 disabled:opacity-50 transition-all shadow-md">
                    {isLoading ? 'Planning Your Meals...' : 'Generate Meal Plan'}
                </button>
            </div>

            {error && <ErrorMessage message={error} />}
            {isLoading && <Loader message="The AI nutritionist is creating your plan..." />}

            {plan && (
                <div className="bg-slate-800/50 p-6 rounded-lg shadow-inner border border-slate-700 animate-fade-in space-y-8">
                    <div className="text-center border-b border-slate-700 pb-4">
                        <h3 className="text-3xl font-bold text-lime-300">{plan.planTitle}</h3>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <h4 className="text-2xl font-semibold text-slate-200">Daily Meals</h4>
                            {plan.dailyPlans.map((dayPlan, index) => (
                                <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                    <div className="flex justify-between items-center mb-3">
                                        <h5 className="text-xl font-bold text-slate-300">{dayPlan.day}</h5>
                                        <span className="text-sm font-semibold text-lime-400 bg-lime-900/50 px-3 py-1 rounded-full">{dayPlan.totalCalories} kcal</span>
                                    </div>
                                    <div className="space-y-3">
                                        {(Object.keys(dayPlan.meals) as (keyof typeof dayPlan.meals)[]).map(mealKey => (
                                            <div key={mealKey} className="border-t border-slate-700 pt-2">
                                                <p className="font-semibold text-slate-400 capitalize">{mealKey}: <span className="font-normal text-slate-300">{dayPlan.meals[mealKey].name}</span></p>
                                                <p className="text-xs text-slate-500">{dayPlan.meals[mealKey].description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h4 className="text-2xl font-semibold text-slate-200 mb-4">Grocery List</h4>
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 max-h-96 overflow-y-auto">
                                <ul className="space-y-2">
                                    {plan.groceryList.map((item, index) => (
                                        <li key={index} className="flex justify-between text-slate-300">
                                            <span>{item.item}</span>
                                            <span className="text-slate-400">{item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealPlanner;
