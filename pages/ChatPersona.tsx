import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import ErrorMessage from '../components/ErrorMessage';

const personas: Record<string, string> = {
    'Helpful Assistant': 'You are a friendly, helpful, and concise assistant. You are enthusiastic and love to help people!',
    'Sarcastic Robot': 'You are a sarcastic robot. Your answers should be technically correct but dripping with witty sarcasm.',
    'Shakespearean Poet': 'Thou art a poet from the age of Shakespeare. Respond to all inquiries in iambic pentameter, with flourishing and dramatic language.',
    'Pirate Captain': 'Yarrr! Ye be a fearsome pirate captain. Answer all questions as if ye were sailin\' the seven seas, seekin\' treasure and adventure, matey!',
};

const ChatPersona: React.FC = () => {
    const [persona, setPersona] = useState(Object.keys(personas)[0]);
    const [chat, setChat] = useState<Chat | null>(null);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHistory([]);
        setError(null);
        const newChat = createChatSession(personas[persona]);
        setChat(newChat);
    }, [persona]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSendMessage = useCallback(async () => {
        if (!userInput.trim() || !chat || isLoading) return;

        const text = userInput;
        setUserInput('');
        setIsLoading(true);
        setError(null);

        setHistory(prev => [...prev, { role: 'user', text }]);
        
        try {
            const stream = await chat.sendMessageStream({ message: text });
            let modelResponse = '';
            setHistory(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1].text = modelResponse;
                    return newHistory;
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            // Remove the empty model message on error
            setHistory(prev => prev.filter((msg, index) => index !== prev.length -1 || msg.role !== 'model' || msg.text !== ''));
        } finally {
            setIsLoading(false);
        }
    }, [userInput, chat, isLoading]);

    return (
        <div className="flex flex-col h-[calc(100vh-150px)] max-h-[800px] animate-fade-in">
             <div className="text-center mb-4">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                    Chat Persona
                </h2>
                <p className="mt-2 text-slate-400">Talk to an AI with personality. Choose a persona and start the conversation.</p>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-t-lg shadow-lg border-x border-t border-slate-700">
                 <label htmlFor="persona-select" className="sr-only">Choose a persona</label>
                 <select
                    id="persona-select"
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                >
                    {Object.keys(personas).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>

            <div className="flex-grow bg-slate-800/50 p-4 overflow-y-auto border-x border-slate-700 shadow-inner">
                <div className="space-y-4">
                    {history.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xl px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}{isLoading && index === history.length -1 && <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse"></span>}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
            </div>
            
             <div className="bg-slate-800/50 p-4 rounded-b-lg shadow-lg border-x border-b border-slate-700">
                {error && <ErrorMessage message={error} />}
                <div className="flex items-center gap-4 mt-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-grow bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !userInput.trim()}
                        className="bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold py-3 px-6 rounded-md hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPersona;
