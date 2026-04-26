'use client';

import { useState } from 'react';
import { PlayCircle, Loader2 } from 'lucide-react';

interface PlaylistInputProps {
    onSubmit: (url: string) => void;
    loading?: boolean;
}

export const PlaylistInput = ({ onSubmit, loading }: PlaylistInputProps) => {
    const [url, setUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim()) {
            onSubmit(url.trim());
            setUrl('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto mb-8 animate-slide-in">
            <div className="flex gap-4">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste YouTube video or playlist URL here..."
                    disabled={loading}
                    className="flex-1 px-6 py-3 rounded-xl border-2 shadow-lg outline-none transition-all duration-300 disabled:opacity-50 bg-[#232323] border-[#2E2E2E] text-[#E5E5E5] focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 bg-green-600 hover:bg-green-700"
                >
                    {loading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <PlayCircle size={20} />
                    )}
                    {loading ? 'Loading...' : 'Load Video'}
                </button>
            </div>
        </form>
    );
};
