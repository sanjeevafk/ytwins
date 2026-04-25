'use client';

import { Input } from '@/components/ui/input';

type NoteSearchProps = {
    query: string;
    onQueryChange: (value: string) => void;
    sortBy: 'updated' | 'created' | 'relevance';
    onSortByChange: (value: 'updated' | 'created' | 'relevance') => void;
    videoId: string;
    onVideoChange: (value: string) => void;
    dateFrom: string;
    onDateFromChange: (value: string) => void;
    dateTo: string;
    onDateToChange: (value: string) => void;
    videoOptions: { value: string; label: string }[];
};

export function NoteSearch({
    query,
    onQueryChange,
    sortBy,
    onSortByChange,
    videoId,
    onVideoChange,
    dateFrom,
    onDateFromChange,
    dateTo,
    onDateToChange,
    videoOptions,
}: NoteSearchProps) {
    return (
        <div className="space-y-3 p-3 border-b border-gray-700 bg-[#1e1e1e]">
            <Input
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Search notes..."
                className="h-9 bg-[#171717] border-[#2E2E2E] text-gray-200 placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-vex-primary"
            />
            <div className="grid grid-cols-2 gap-2">
                <select
                    value={sortBy}
                    onChange={(event) => onSortByChange(event.target.value as 'updated' | 'created' | 'relevance')}
                    className="h-9 rounded-md border border-[#2E2E2E] bg-[#171717] px-2 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-vex-primary"
                >
                    <option value="updated">Updated</option>
                    <option value="created">Created</option>
                    <option value="relevance">Relevance</option>
                </select>
                <select
                    value={videoId}
                    onChange={(event) => onVideoChange(event.target.value)}
                    className="h-9 rounded-md border border-[#2E2E2E] bg-[#171717] px-2 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-vex-primary"
                >
                    <option value="">All videos</option>
                    {videoOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <input
                    type="date"
                    value={dateFrom}
                    onChange={(event) => onDateFromChange(event.target.value)}
                    className="h-9 rounded-md border border-[#2E2E2E] bg-[#171717] px-2 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-vex-primary"
                />
                <input
                    type="date"
                    value={dateTo}
                    onChange={(event) => onDateToChange(event.target.value)}
                    className="h-9 rounded-md border border-[#2E2E2E] bg-[#171717] px-2 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-vex-primary"
                />
            </div>
        </div>
    );
}
