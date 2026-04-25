'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { StoredNote } from '@/lib/notes';
import { getInitialReviewData, scheduleNextReview, type ReviewData } from '@/lib/spacedRepetition';

const REVIEW_KEY = 'vextube_review_data';

type ReviewMap = Record<string, ReviewData>;

const loadReviewData = (): ReviewMap => {
    if (typeof window === 'undefined') return {};
    try {
        const raw = localStorage.getItem(REVIEW_KEY);
        return raw ? (JSON.parse(raw) as ReviewMap) : {};
    } catch {
        return {};
    }
};

const saveReviewData = (data: ReviewMap) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(REVIEW_KEY, JSON.stringify(data));
};

export const useSpacedRepetition = (notes: StoredNote[]) => {
    const [reviewData, setReviewData] = useState<ReviewMap>(() => loadReviewData());
    const [now, setNow] = useState<number | null>(null);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => setNow(Date.now()), 0);
        const intervalId = window.setInterval(() => setNow(Date.now()), 60_000);

        return () => {
            window.clearTimeout(timeoutId);
            window.clearInterval(intervalId);
        };
    }, []);

    const dueNotes = useMemo(() => {
        const currentTime = now ?? 0;
        return notes
            .filter((note) => {
                const data = reviewData[note.videoId] ?? getInitialReviewData(note.videoId);
                return data.dueAt <= currentTime;
            })
            .sort((a, b) => {
                const dueA = (reviewData[a.videoId] ?? getInitialReviewData(a.videoId)).dueAt;
                const dueB = (reviewData[b.videoId] ?? getInitialReviewData(b.videoId)).dueAt;
                return dueA - dueB;
            });
    }, [notes, reviewData, now]);

    const upcomingNotes = useMemo(() => {
        const currentTime = now ?? 0;
        return notes
            .filter((note) => {
                const data = reviewData[note.videoId] ?? getInitialReviewData(note.videoId);
                return data.dueAt > currentTime;
            })
            .sort((a, b) => {
                const dueA = (reviewData[a.videoId] ?? getInitialReviewData(a.videoId)).dueAt;
                const dueB = (reviewData[b.videoId] ?? getInitialReviewData(b.videoId)).dueAt;
                return dueA - dueB;
            });
    }, [notes, reviewData, now]);

    const rateNote = useCallback((videoId: string, rating: number) => {
        setReviewData((prev) => {
            const current = prev[videoId] ?? getInitialReviewData(videoId);
            const next = scheduleNextReview(current, rating);
            const updated = { ...prev, [videoId]: next };
            saveReviewData(updated);
            return updated;
        });
    }, []);

    return {
        dueNotes,
        upcomingNotes,
        rateNote,
        reviewData,
    };
};
