'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export type Stats = {
    total_videos: number;
    completed_videos: number;
    total_notes: number;
    total_collections: number;
};

export function StatsDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const response = await api.get<Stats>('/stats');
            if (!response.error && response.data) {
                setStats(response.data);
            }
            setIsLoading(false);
        };
        fetchStats();
    }, []);

    if (isLoading) return <div className="text-center py-10 text-gray-500">Loading stats...</div>;
    if (!stats) return null;

    const completionPercent = stats.total_videos > 0 
        ? Math.round((stats.completed_videos / stats.total_videos) * 100) 
        : 0;

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            <div className="rounded-2xl border border-[#2E2E2E] bg-[#232323] p-6 shadow-xl">
                <h2 className="text-2xl font-semibold text-white">Learning Stats</h2>
                <p className="text-sm text-vex-muted">A snapshot of your progress and notes.</p>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-[#2E2E2E] bg-[#171717] p-4">
                        <p className="text-xs uppercase tracking-wide text-vex-muted">Completion</p>
                        <p className="text-2xl font-semibold text-white">{completionPercent}%</p>
                        <p className="text-xs text-vex-muted">{stats.completed_videos} of {stats.total_videos} videos</p>
                    </div>
                    <div className="rounded-xl border border-[#2E2E2E] bg-[#171717] p-4">
                        <p className="text-xs uppercase tracking-wide text-vex-muted">Notes</p>
                        <p className="text-2xl font-semibold text-white">{stats.total_notes}</p>
                        <p className="text-xs text-vex-muted">Total notes captured</p>
                    </div>
                    <div className="rounded-xl border border-[#2E2E2E] bg-[#171717] p-4">
                        <p className="text-xs uppercase tracking-wide text-vex-muted">Collections</p>
                        <p className="text-2xl font-semibold text-white">{stats.total_collections}</p>
                        <p className="text-xs text-vex-muted">Organized groups</p>
                    </div>
                </div>
            </div>
            <div className="rounded-2xl border border-[#2E2E2E] bg-[#232323] p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
                <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-vex-muted">Videos completed</span>
                    <span className="text-white">{stats.completed_videos} / {stats.total_videos}</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-[#171717]">
                    <div
                        className="h-2 rounded-full bg-vex-primary"
                        style={{ width: `${completionPercent}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
