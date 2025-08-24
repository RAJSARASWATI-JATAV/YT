import React, { useState, useCallback } from 'react';
import { generateEmail } from '../services/geminiService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const purposes = ["Meeting Request", "Thank You", "Follow-up", "Inquiry", "Apology", "Custom"];
const tones = ["Formal", "Casual", "Friendly", "Persuasive", "Direct"];

const EmailWriter: React.FC = () => {
    const [purpose, setPurpose] = useState(purposes[0]);
    const [customPurpose, setCustomPurpose] = useState('');
    const [tone, setTone] = useState(tones[0]);
    const [recipientInfo, setRecipientInfo] = useState('');
    const [moreInfo, setMoreInfo] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState('');

    const handleGenerate = useCallback(async () => {
        const finalPurpose = purpose === "Custom" ? customPurpose : purpose;
        if (!finalPurpose.trim() || !recipientInfo.trim()) {
            setError("Please provide the purpose and recipient information.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setEmail('');
        setCopySuccess('');

        try {
            const result = await generateEmail(finalPurpose, tone, recipientInfo, moreInfo);
            setEmail(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [purpose, customPurpose, tone, recipientInfo, moreInfo]);

    const handleCopy = useCallback(() => {
        if (!email) return;
        navigator.clipboard.writeText(email).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    }, [email]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                    AI Email Writer
                </h2>
                <p className="mt-2 text-slate-400">Draft professional and effective emails in seconds.</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="purpose" className="block text-sm font-medium text-slate-300 mb-1">Purpose of Email</label>
                        <select id="purpose" value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-blue-500" disabled={isLoading}>
                            {purposes.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tone" className="block text-sm font-medium text-slate-300 mb-1">Tone</label>
                        <select id="tone" value={tone} onChange={e => setTone(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-blue-500" disabled={isLoading}>
                            {tones.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
                {purpose === 'Custom' && (
                    <input type="text" value={customPurpose} onChange={e => setCustomPurpose(e.target.value)} placeholder="Describe your custom purpose..." className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-blue-500" disabled={isLoading} />
                )}
                 <div>
                    <label htmlFor="recipient" className="block text-sm font-medium text-slate-300 mb-1">Recipient Info</label>
                    <input id="recipient" type="text" value={recipientInfo} onChange={e => setRecipientInfo(e.target.value)} placeholder="e.g., My manager, John Doe" className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-blue-500" disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="moreInfo" className="block text-sm font-medium text-slate-300 mb-1">Key Points / Additional Info</label>
                    <textarea id="moreInfo" value={moreInfo} onChange={e => setMoreInfo(e.target.value)} placeholder="e.g., I want to discuss the Q3 report. I am available on Tuesday or Thursday afternoon." className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-blue-500" rows={4} disabled={isLoading} />
                </div>
                <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold py-3 px-6 rounded-md hover:from-blue-600 hover:to-teal-600 disabled:opacity-50 transition-all shadow-md">
                    {isLoading ? 'Drafting Email...' : 'Generate Email'}
                </button>
            </div>

            {error && <ErrorMessage message={error} />}
            {isLoading && <Loader message="The AI is writing your email..." />}

            {email && (
                <div className="bg-slate-800/50 p-6 rounded-lg shadow-inner border border-slate-700 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-slate-200">Generated Email:</h3>
                        <button onClick={handleCopy} className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-bold py-1 px-3 rounded-md transition-colors">
                            {copySuccess || 'Copy Email'}
                        </button>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-md text-slate-300 whitespace-pre-wrap">{email}</div>
                </div>
            )}
        </div>
    );
};

export default EmailWriter;
