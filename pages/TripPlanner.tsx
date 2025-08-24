import React, { useState, useCallback } from 'react';
import { generateTripPlan } from '../services/geminiService';
import { TripPlan, ActivityCategory } from '../types';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { Utensils, Camera, MountainSnow, Palette, Coffee, Plane } from 'lucide-react';

const budgets = ["Budget", "Mid-range", "Luxury"];

const categoryIcons: { [key in ActivityCategory]: React.ReactNode } = {
    Food: <Utensils className="h-5 w-5" />,
    Sightseeing: <Camera className="h-5 w-5" />,
    Activity: <MountainSnow className="h-5 w-5" />,
    Culture: <Palette className="h-5 w-5" />,
    Relaxation: <Coffee className="h-5 w-5" />,
    Travel: <Plane className="h-5 w-5" />,
};

const categoryColors: { [key in ActivityCategory]: string } = {
    Food: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
    Sightseeing: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    Activity: 'bg-green-500/20 text-green-300 border-green-500/50',
    Culture: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    Relaxation: 'bg-teal-500/20 text-teal-300 border-teal-500/50',
    Travel: 'bg-red-500/20 text-red-300 border-red-500/50',
};

const TripPlanner: React.FC = () => {
    const [destination, setDestination] = useState('');
    const [duration, setDuration] = useState(5);
    const [interests, setInterests] = useState('');
    const [budget, setBudget] = useState(budgets[1]);
    const [plan, setPlan] = useState<TripPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePlan = useCallback(async () => {
        if (!destination.trim() || !interests.trim()) {
            setError("Please provide a destination and your interests.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setPlan(null);

        try {
            const result = await generateTripPlan(destination, duration, interests, budget);
            setPlan(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [destination, duration, interests, budget]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400">
                    AI Trip Planner
                </h2>
                <p className="mt-2 text-slate-400">Your personal travel agent. Plan your next adventure in moments.</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="destination" className="block text-sm font-medium text-slate-300 mb-1">Destination</label>
                        <input id="destination" type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g., Tokyo, Japan" className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-violet-500" disabled={isLoading} />
                    </div>
                     <div>
                        <label htmlFor="interests" className="block text-sm font-medium text-slate-300 mb-1">Interests</label>
                        <input id="interests" type="text" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="e.g., History, Sushi, Anime" className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-violet-500" disabled={isLoading} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-slate-300 mb-1">Trip Duration (days)</label>
                        <input id="duration" type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value, 10))} min="1" max="14" className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-violet-500" disabled={isLoading} />
                    </div>
                    <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-slate-300 mb-1">Budget</label>
                        <select id="budget" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-violet-500" disabled={isLoading}>
                            {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                </div>
                <button
                    onClick={handleGeneratePlan}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-violet-600 to-sky-500 text-white font-bold py-3 px-6 rounded-md hover:from-violet-700 hover:to-sky-600 disabled:opacity-50 transition-all shadow-md"
                >
                    {isLoading ? 'Planning Your Trip...' : 'Generate Itinerary'}
                </button>
            </div>

            {error && <ErrorMessage message={error} />}
            {isLoading && <Loader message="The AI is crafting your personalized travel itinerary..." />}

            {plan && (
                <div className="bg-slate-800/50 p-6 rounded-lg shadow-inner border border-slate-700 animate-fade-in space-y-6">
                    <div className="text-center border-b border-slate-700 pb-4">
                        <h3 className="text-3xl font-bold text-sky-300">{plan.tripTitle}</h3>
                    </div>
                    <div className="relative pl-6">
                        {/* Vertical line for timeline */}
                        <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-slate-600"></div>

                        {plan.itinerary.map((dayPlan) => (
                            <div key={dayPlan.day} className="relative mb-8">
                                <div className="absolute -left-1.5 top-1 h-8 w-8 rounded-full bg-slate-700 border-4 border-slate-800 flex items-center justify-center">
                                    <span className="font-bold text-sky-400">{dayPlan.day}</span>
                                </div>
                                <div className="pl-12">
                                    <h4 className="text-xl font-semibold text-slate-200 mb-2">{dayPlan.title}</h4>
                                    <div className="space-y-4">
                                        {dayPlan.activities.map((activity, index) => (
                                            <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h5 className="font-bold text-slate-300">{activity.title}</h5>
                                                    <span className={`flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full border ${categoryColors[activity.category]}`}>
                                                        {categoryIcons[activity.category]}
                                                        {activity.category}
                                                    </span>
                                                </div>
                                                <p className="text-slate-400">{activity.description}</p>
                                                <p className="text-xs text-slate-500 mt-2 font-semibold">{activity.timeOfDay}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TripPlanner;
