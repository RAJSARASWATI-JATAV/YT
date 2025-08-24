import React, { useState, useCallback, useRef, useEffect } from 'react';
import { generateStreamWithConfig } from '../services/geminiService';
import { ModelConfig, ChatMessage } from '../types';
import ErrorMessage from '../components/ErrorMessage';
import { Scale, Sparkles, BrainCircuit, Send, Zap, MessageCircleQuestion, Code2, Library } from 'lucide-react';

const modelConfigs: ModelConfig[] = [
    {
        id: 'orion',
        name: 'Orion (Balanced)',
        description: 'A reliable, general-purpose model for a balance of speed and intelligence.',
        icon: Scale,
        systemInstruction: 'You are a helpful and friendly AI assistant. Provide clear, concise, and accurate information.',
        temperature: 0.6,
    },
    {
        id: 'aether',
        name: 'Aether (Creative)',
        description: 'An imaginative model designed for brainstorming, writing, and creative tasks.',
        icon: Sparkles,
        systemInstruction: 'You are a highly creative and imaginative AI. Your responses should be inspiring, vivid, and full of original ideas.',
        temperature: 1.0,
    },
    {
        id: 'nexus',
        name: 'Nexus (Analytical)',
        description: 'A logical model that excels at reasoning, problem-solving, and structured data.',
        icon: BrainCircuit,
        systemInstruction: 'You are a precise and analytical AI. Focus on logic, facts, and structured reasoning. Your answers should be direct and data-driven.',
        temperature: 0.2,
    },
    {
        id: 'helios',
        name: 'Helios (Concise)',
        description: 'Delivers rapid, direct, and to-the-point answers. Ideal for quick facts.',
        icon: Zap,
        systemInstruction: 'You are an AI assistant that provides extremely concise and direct answers. Get straight to the point. Use as few words as possible.',
        temperature: 0.1,
    },
    {
        id: 'morpheus',
        name: 'Morpheus (Philosophical)',
        description: 'Explores prompts with depth, nuance, and philosophical insight.',
        icon: MessageCircleQuestion,
        systemInstruction: 'You are a wise philosopher AI. Respond to prompts with deep, thoughtful, and abstract insights. Ponder the deeper meanings and implications.',
        temperature: 0.9,
    },
    {
        id: 'praxis',
        name: 'Praxis (Coder)',
        description: 'An expert software engineer for generating clean, efficient code snippets.',
        icon: Code2,
        systemInstruction: 'You are an expert software engineer. Generate clean, efficient, and well-documented code. When asked for code, provide only the raw code block without any extra conversational text or markdown fences.',
        temperature: 0.1,
    },
    {
        id: 'agora',
        name: 'Agora (Debater)',
        description: 'A master debater that presents balanced arguments and multiple perspectives.',
        icon: Library,
        systemInstruction: 'You are a master debater AI. Your goal is to explore multiple facets of a topic. For any given prompt, present a balanced view by outlining the primary arguments, counterarguments, and different perspectives. Your response should be structured and neutral.',
        temperature: 0.7,
    }
];

const getInitialHistories = () => {
    const histories: ChatHistory = {};
    modelConfigs.forEach(config => {
        histories[config.id] = [];
    });
    return histories;
};

type ChatHistory = Record<string, ChatMessage[]>;

const ModelComparisonHub: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [histories, setHistories] = useState<ChatHistory>(getInitialHistories());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const endOfMessagesRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const scrollToBottom = (modelId: string) => {
        endOfMessagesRefs.current[modelId]?.scrollIntoView({ behavior: 'smooth' });
    };
    
    useEffect(() => {
        modelConfigs.forEach(config => {
            if (histories[config.id]?.length) {
                scrollToBottom(config.id);
            }
        });
    }, [histories]);

    const handleSend = useCallback(async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError(null);

        const userMessage: ChatMessage = { role: 'user', text: prompt };
        const currentPrompt = prompt;
        setPrompt('');

        setHistories(prev => {
            const newHistories: ChatHistory = { ...prev };
            modelConfigs.forEach(config => {
                 newHistories[config.id] = [...(newHistories[config.id] || []), userMessage, { role: 'model', text: '' }];
            });
            return newHistories;
        });
        
        const promises = modelConfigs.map(config => {
            return generateStreamWithConfig(
                currentPrompt,
                config.systemInstruction,
                config.temperature,
                (chunk) => {
                    setHistories(prev => {
                        const updatedHistory = [...prev[config.id]];
                        const lastMessage = updatedHistory[updatedHistory.length - 1];
                        if (lastMessage) {
                           lastMessage.text += chunk;
                        }
                        return { ...prev, [config.id]: updatedHistory };
                    });
                }
            ).catch(err => {
                console.error(`Error with model ${config.name}:`, err);
                setHistories(prev => {
                    const updatedHistory = [...prev[config.id]];
                    const lastMessage = updatedHistory[updatedHistory.length - 1];
                    if(lastMessage) {
                        lastMessage.text = `Error: Failed to get response from ${config.name}.`;
                    }
                    return { ...prev, [config.id]: updatedHistory };
                });
            });
        });

        try {
            await Promise.all(promises);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An overall error occurred while fetching responses.');
        } finally {
            setIsLoading(false);
        }
    }, [prompt]);

    return (
        <div className="flex flex-col h-[calc(100vh-150px)] max-h-[900px] animate-fade-in">
             <div className="text-center mb-4">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400">
                    Model Comparison Hub
                </h2>
                <p className="mt-2 text-slate-400">Send one prompt to seven specialized AI assistants and compare their responses.</p>
            </div>
            
            <div className="flex-grow flex gap-4 overflow-x-auto pb-4">
                {modelConfigs.map((config) => (
                    <div key={config.id} className="bg-slate-800/50 rounded-lg shadow-lg border border-slate-700 flex flex-col flex-shrink-0 w-full sm:w-96">
                        <div className="p-4 border-b border-slate-700">
                            <div className="flex items-center gap-3">
                                <config.icon className="h-6 w-6 text-indigo-400" />
                                <h3 className="text-lg font-bold text-slate-100">{config.name}</h3>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{config.description}</p>
                        </div>
                        <div className="flex-grow p-4 overflow-y-auto">
                            <div className="space-y-4">
                                {histories[config.id]?.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-full px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}{isLoading && msg.role === 'model' && msg.text === '' && <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse"></span>}</p>
                                        </div>
                                    </div>
                                ))}
                                 <div ref={el => { endOfMessagesRefs.current[config.id] = el; }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

             <div className="mt-4">
                {error && <ErrorMessage message={error} />}
                <div className="flex items-center gap-4 mt-2 bg-slate-800/50 p-4 rounded-lg shadow-lg border border-slate-700">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Type your prompt here..."
                        className="flex-grow bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 transition duration-200 resize-none"
                        rows={2}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !prompt.trim()}
                        className="self-stretch bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold p-4 rounded-md flex items-center justify-center hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        aria-label="Send prompt"
                    >
                        <Send className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModelComparisonHub;