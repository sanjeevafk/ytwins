'use client';

import { useMemo, useState } from 'react';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';

interface ReviewModeProps {
    onOpenVideo: (videoId: string) => void;
}

export function ReviewMode({ onOpenVideo }: ReviewModeProps) {
    const { dueNotes, upcomingNotes, rateNote, isLoading } = useSpacedRepetition();
    const [activeReviewId, setActiveReviewId] = useState<number | null>(null);

    const activeReview = useMemo(
        () => dueNotes.find((r) => r.id === activeReviewId) ?? null,
        [activeReviewId, dueNotes]
    );

    const handleRate = (rating: number) => {
        if (!activeReview) return;
        rateNote(activeReview.id, rating);
        setActiveReviewId(null);
    };

    if (isLoading) {
        return <div className="text-center py-10 text-gray-500">Loading reviews...</div>;
    }

    if (activeReview) {
        return (
            <div className="w-full max-w-4xl mx-auto space-y-6">
                <div className="rounded-2xl border border-[#2E2E2E] bg-[#232323] p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-vex-muted">Reviewing</p>
                            <h2 className="text-xl font-semibold text-white">{activeReview.note?.title || 'Untitled Note'}</h2>
                        </div>
                        <button
                            onClick={() => onOpenVideo(activeReview.note?.youtube_id || '')}
                            className="rounded-lg border border-vex-border bg-vex-surface px-3 py-1.5 text-xs font-semibold text-vex-primary hover:bg-vex-surfaceHover"
                        >
                            Open Video
                        </button>
                    </div>
                    <div className="mt-4 rounded-lg border border-[#2E2E2E] bg-[#171717] p-4 text-sm text-gray-200 whitespace-pre-wrap">
                        {activeReview.note?.content}
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
                    onClick={() => setActiveReviewId(null)}
                    className="text-sm text-vex-muted hover:text-white"
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
                        <p className="text-sm text-vex-muted">{dueNotes.length} items due today</p>
                    </div>
                    <span className="rounded-full bg-vex-primary/10 px-3 py-1 text-xs font-semibold text-vex-primary">
                        Upcoming: {upcomingNotes.length}
                    </span>
                </div>
                {dueNotes.length === 0 ? (
                    <p className="mt-6 text-sm text-gray-400">You are all caught up. Check back later for new reviews.</p>
                ) : (
                    <div className="mt-6 space-y-3">
                        {dueNotes.map((review) => (
                            <div
                                key={review.id}
                                className="flex items-center justify-between rounded-lg border border-[#2E2E2E] bg-[#171717] p-4"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-gray-200">{review.note?.title || 'Untitled Note'}</p>
                                    <p className="text-xs text-vex-muted">Due at {new Date(review.due_at).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => setActiveReviewId(review.id)}
                                    className="rounded-lg bg-vex-primary px-3 py-1.5 text-xs font-semibold text-black hover:bg-vex-primaryHover"
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
