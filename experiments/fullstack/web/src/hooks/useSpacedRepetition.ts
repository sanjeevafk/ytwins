'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import { api } from '@/lib/api';

export type Review = {
    id: number;
    note_id: number;
    due_at: string;
    ease: number;
    interval_days: number;
    repetitions: number;
    note?: {
        content: string;
        title: string;
        youtube_id: string;
    };
};

export const useSpacedRepetition = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReviews = useCallback(async (showLoading = false) => {
        if (showLoading) setIsLoading(true);
        const response = await api.get<Review[]>('/reviews');
        if (!response.error && response.data) {
            setReviews(response.data);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            const response = await api.get<Review[]>('/reviews');
            if (mounted && !response.error && response.data) {
                setReviews(response.data);
            }
            if (mounted) setIsLoading(false);
        };
        void load();
        return () => { mounted = false; };
    }, []);

    const rateNote = useCallback(async (reviewId: number, rating: number) => {
        const response = await api.post(`/reviews/${reviewId}/rate`, { rating });
        if (!response.error) {
            void fetchReviews(true); // Refresh
        }
    }, [fetchReviews]);

    const [now] = useState(() => Date.now());

    const { dueNotes, upcomingNotes } = useMemo(() => {
        return {
            dueNotes: reviews.filter(r => new Date(r.due_at).getTime() <= now),
            upcomingNotes: reviews.filter(r => new Date(r.due_at).getTime() > now)
        };
    }, [reviews, now]);

    return {
        dueNotes,
        upcomingNotes,
        rateNote,
        isLoading,
        refresh: fetchReviews
    };
};
