import React, { useState, useCallback } from 'react';
import { generateWorkoutPlan } from '../services/geminiService';
import { WorkoutPlan } from '../types';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { Dumbbell, Zap, HeartPulse } from 'lucide-react';

const goals = ["Build Muscle", "Lose Weight", "Improve Endurance", "General Fitness"];
const levels = ["Beginner", "Intermediate", "Advanced"];

const WorkoutPlanner: React.FC = () => {
    const [goal, setGoal] = useState(goals[0]);
    const [level, setLevel] = useState(levels[0]);
    const [daysPerWeek, setDaysPerWeek] = useState(3);
    const [plan, setPlan] = useState<WorkoutPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePlan = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setPlan(null);

        try {
            const result = await generateWorkoutPlan(goal, level, daysPerWeek);
            setPlan(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [goal, level, daysPerWeek]);
    
    const getGoalIcon = (goal: string) => {
        switch (goal) {
            case "Build Muscle": return <Dumbbell className="h-5 w-5 mr-2" />;
            case "Lose Weight": return <Zap className="h-5 w-5 mr-2" />;
            case "Improve Endurance": return <HeartPulse className="h-5 w-5 mr-2" />;
            default: return <Dumbbell className="h-5 w-5 mr-2" />;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                    AI Workout Planner
                </h2>
                <p className="mt-2 text-slate-400">Get a personalized weekly workout plan based on your fitness goals.</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="goal" className="block text-sm font-medium text-slate-300 mb-1">Primary Goal</label>
                        <select id="goal" value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-red-500" disabled={isLoading}>
                            {goals.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="level" className="block text-sm font-medium text-slate-300 mb-1">Fitness Level</label>
                        <select id="level" value={level} onChange={e => setLevel(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-red-500" disabled={isLoading}>
                            {levels.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="days" className="block text-sm font-medium text-slate-300 mb-1">Days per Week</label>
                        <input id="days" type="number" value={daysPerWeek} onChange={e => setDaysPerWeek(parseInt(e.target.value, 10))} min="1" max="7" className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-red-500" disabled={isLoading} />
                    </div>
                </div>
                <button onClick={handleGeneratePlan} disabled={isLoading} className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 px-6 rounded-md hover:from-red-600 hover:to-orange-600 disabled:opacity-50 transition-all shadow-md">
                    {isLoading ? 'Building Your Plan...' : 'Generate Workout Plan'}
                </button>
            </div>

            {error && <ErrorMessage message={error} />}
            {isLoading && <Loader message="The AI trainer is designing your workout..." />}

            {plan && (
                <div className="bg-slate-800/50 p-6 rounded-lg shadow-inner border border-slate-700 animate-fade-in space-y-6">
                    <div className="text-center border-b border-slate-700 pb-4">
                        <h3 className="text-3xl font-bold text-orange-300">{plan.planTitle}</h3>
                    </div>
                    <div className="space-y-8">
                        {plan.weeklySchedule.map((dayPlan, index) => (
                            <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                <h4 className="text-xl font-semibold text-slate-200 mb-3 flex items-center">
                                    {getGoalIcon(dayPlan.focus)}
                                    {dayPlan.day}: <span className="text-orange-400 ml-2">{dayPlan.focus}</span>
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-700">
                                        <thead className="bg-slate-800/50">
                                            <tr>
                                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Exercise</th>
                                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Sets</th>
                                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Reps</th>
                                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Rest</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {dayPlan.exercises.map((ex, exIndex) => (
                                                <tr key={exIndex}>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-300">{ex.name}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-400">{ex.sets}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-400">{ex.reps}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-400">{ex.rest}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkoutPlanner;
