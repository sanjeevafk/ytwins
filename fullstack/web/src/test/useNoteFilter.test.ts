import { renderHook } from '@testing-library/react';
import { useNoteFilter, NoteItem, NoteFilterOptions } from '../hooks/useNoteFilter';
import { describe, it, expect } from 'vitest';

describe('useNoteFilter', () => {
    const mockNotes: NoteItem[] = [
        {
            id: 1,
            content: 'React is a library',
            title: 'Video 1',
            updatedAt: '2023-01-01T10:00:00Z',
            createdAt: '2023-01-01T10:00:00Z',
            videoId: 'v1',
            timestamp_seconds: 10,
        },
        {
            id: 2,
            content: 'Sinatra is for Ruby',
            title: 'Video 2',
            updatedAt: '2023-01-02T10:00:00Z',
            createdAt: '2023-01-02T10:00:00Z',
            videoId: 'v2',
            timestamp_seconds: 20,
        },
    ];

    const defaultOptions: NoteFilterOptions = {
        query: '',
        sortBy: 'updated',
        videoId: '',
        dateFrom: '',
        dateTo: '',
    };

    it('returns all notes when no filters are applied', () => {
        const { result } = renderHook(() => useNoteFilter(mockNotes, defaultOptions));
        expect(result.current).toHaveLength(2);
    });

    it('filters by query', () => {
        const { result } = renderHook(() => useNoteFilter(mockNotes, { ...defaultOptions, query: 'React' }));
        // Initial call uses the query value immediately for filtering
        expect(result.current).toHaveLength(1);
    });

    it('filters by videoId', () => {
        const { result } = renderHook(() => useNoteFilter(mockNotes, { ...defaultOptions, videoId: 'v1' }));
        expect(result.current).toHaveLength(1);
        expect(result.current[0].id).toBe(1);
    });

    it('sorts by updated date descending', () => {
        const { result } = renderHook(() => useNoteFilter(mockNotes, { ...defaultOptions, sortBy: 'updated' }));
        expect(result.current[0].id).toBe(2); // Jan 2 is newer than Jan 1
    });
});
