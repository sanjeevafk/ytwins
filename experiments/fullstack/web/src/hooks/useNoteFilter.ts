'use client';

import { useEffect, useMemo, useState } from 'react';

export type NoteFilterOptions = {
    query: string;
    sortBy: 'updated' | 'created' | 'relevance';
    videoId: string;
    dateFrom: string;
    dateTo: string;
};

export type NoteItem = {
    id: number;
    key?: string;
    content: string;
    title: string;
    updatedAt: string;
    createdAt: string;
    videoId: string;
    timestamp_seconds: number;
};

const getMatchScore = (note: NoteItem, query: string) => {
    if (!query) return 0;
    const normalizedQuery = query.toLowerCase();
    const content = note.content.toLowerCase();
    const title = note.title.toLowerCase();

    const titleMatches = title.split(normalizedQuery).length - 1;
    const contentMatches = content.split(normalizedQuery).length - 1;

    return titleMatches * 3 + contentMatches;
};

const parseDate = (value: string, endOfDay = false) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    if (endOfDay) {
        date.setHours(23, 59, 59, 999);
    } else {
        date.setHours(0, 0, 0, 0);
    }
    return date;
};

export const useNoteFilter = (notes: NoteItem[], options: NoteFilterOptions) => {
    const [debouncedQuery, setDebouncedQuery] = useState(options.query);

    useEffect(() => {
        const handle = setTimeout(() => setDebouncedQuery(options.query), 300);
        return () => clearTimeout(handle);
    }, [options.query]);

    return useMemo(() => {
        const fromDate = parseDate(options.dateFrom);
        const toDate = parseDate(options.dateTo, true);

        const filtered = notes.filter((note) => {
            if (options.videoId && note.videoId !== options.videoId) return false;

            const noteDate = new Date(note.updatedAt);
            if (fromDate && noteDate < fromDate) return false;
            if (toDate && noteDate > toDate) return false;

            if (!debouncedQuery) return true;
            const normalizedQuery = debouncedQuery.toLowerCase();
            return (
                note.title.toLowerCase().includes(normalizedQuery) ||
                note.content.toLowerCase().includes(normalizedQuery)
            );
        });

        return filtered.sort((a, b) => {
            if (options.sortBy === 'relevance') {
                const scoreA = getMatchScore(a, debouncedQuery);
                const scoreB = getMatchScore(b, debouncedQuery);
                if (scoreA !== scoreB) return scoreB - scoreA;
            }

            if (options.sortBy === 'created') {
                const createdA = new Date(a.createdAt ?? a.updatedAt).getTime();
                const createdB = new Date(b.createdAt ?? b.updatedAt).getTime();
                return createdB - createdA;
            }

            const updatedA = new Date(a.updatedAt).getTime();
            const updatedB = new Date(b.updatedAt).getTime();
            return updatedB - updatedA;
        });
    }, [debouncedQuery, notes, options.dateFrom, options.dateTo, options.sortBy, options.videoId]);
};
