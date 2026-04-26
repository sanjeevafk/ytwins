'use client';

import { useMemo, useState } from 'react';
import type { StoredNote } from '@/lib/notes';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';

interface ReviewModeProps {
    notes: StoredNote[];
    onOpenVideo: (videoId: string) => void;
}

export function ReviewMode({ notes, onOpenVideo }: ReviewModeProps) {
    const { dueNotes, upcomingNotes, rateNote } = useSpacedRepetition(notes);
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

    const activeNote = useMemo(
        () => dueNotes.find((note) => note.videoId === activeVideoId) ?? null,
        [activeVideoId, dueNotes]
    );

    const handleRate = (rating: number) => {
        if (!activeNote) return;
        rateNote(activeNote.videoId, rating);
        setActiveVideoId(null);
    };

    if (activeNote) {
        return (
            <div className="w-full max-w-4xl mx-auto space-y-6">
                <div className="rounded-2xl border border-[#2E2E2E] bg-[#232323] p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-focus-muted">Reviewing</p>
                            <h2 className="text-xl font-semibold text-white">{activeNote.title}</h2>
                        </div>
                        <button
                            onClick={() => onOpenVideo(activeNote.videoId)}
                            className="rounded-lg border border-focus-border bg-focus-surface px-3 py-1.5 text-xs font-semibold text-focus-primary hover:bg-focus-surfaceHover"
                        >
                            Open Video
                        </button>
                    </div>
                    <div className="mt-4 rounded-lg border border-[#2E2E2E] bg-[#171717] p-4 text-sm text-gray-200 whitespace-pre-wrap">
                        {activeNote.content}
                    </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => handleRate(rating)}
                            className="rounded-lg border border-[#2E2E2E] bg-[#171717] px-2 py-2 text-sm font-semibold text-gray-200 hover:bg-[#2E2E2E]"
                        >
                            {rating}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setActiveVideoId(null)}
                    className="text-sm text-focus-muted hover:text-white"
                >
                    Back to list
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="rounded-2xl border border-[#2E2E2E] bg-[#232323] p-6 shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-white">Review Mode</h2>
                        <p className="text-sm text-focus-muted">{dueNotes.length} notes due today</p>
                    </div>
                    <span className="rounded-full bg-focus-primary/10 px-3 py-1 text-xs font-semibold text-focus-primary">
                        Upcoming: {upcomingNotes.length}
                    </span>
                </div>
                {dueNotes.length === 0 ? (
                    <p className="mt-6 text-sm text-gray-400">You are all caught up. Check back later for new reviews.</p>
                ) : (
                    <div className="mt-6 space-y-3">
                        {dueNotes.map((note) => (
                            <div
                                key={note.videoId}
                                className="flex items-center justify-between rounded-lg border border-[#2E2E2E] bg-[#171717] p-4"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-gray-200">{note.title}</p>
                                    <p className="text-xs text-focus-muted">Last updated {new Date(note.updatedAt).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => setActiveVideoId(note.videoId)}
                                    className="rounded-lg bg-focus-primary px-3 py-1.5 text-xs font-semibold text-black hover:bg-focus-primaryHover"
                                >
                                    Review
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
