'use client';

import { useMemo } from 'react';
import type { PlaylistData } from '@/lib/types';
import type { StoredNote } from '@/lib/notes';
import { calculatePlaylistStats, loadStorageSummary } from '@/lib/statsCalculator';

interface StatsDashboardProps {
    playlistData: PlaylistData;
    notes: StoredNote[];
}

export function StatsDashboard({ playlistData, notes }: StatsDashboardProps) {
    const playlistStats = useMemo(() => calculatePlaylistStats(playlistData, notes), [playlistData, notes]);
    const overall = useMemo(() => loadStorageSummary(), []);

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            <div className="rounded-2xl border border-[#2E2E2E] bg-[#232323] p-6 shadow-xl">
                <h2 className="text-2xl font-semibold text-white">Learning Stats</h2>
                <p className="text-sm text-vex-muted">A snapshot of your progress and notes.</p>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-[#2E2E2E] bg-[#171717] p-4">
                        <p className="text-xs uppercase tracking-wide text-vex-muted">Completion</p>
                        <p className="text-2xl font-semibold text-white">{playlistStats.completionPercent}%</p>
                        <p className="text-xs text-vex-muted">{playlistStats.completedVideos} of {playlistStats.totalVideos} videos</p>
                    </div>
                    <div className="rounded-xl border border-[#2E2E2E] bg-[#171717] p-4">
                        <p className="text-xs uppercase tracking-wide text-vex-muted">Notes</p>
                        <p className="text-2xl font-semibold text-white">{playlistStats.notesCount}</p>
                        <p className="text-xs text-vex-muted">{playlistStats.notesPerVideo} notes per video</p>
                    </div>
                    <div className="rounded-xl border border-[#2E2E2E] bg-[#171717] p-4">
                        <p className="text-xs uppercase tracking-wide text-vex-muted">Playlists</p>
                        <p className="text-2xl font-semibold text-white">{overall.totalPlaylists}</p>
                        <p className="text-xs text-vex-muted">{overall.totalVideos} videos tracked</p>
                    </div>
                </div>
            </div>
            <div className="rounded-2xl border border-[#2E2E2E] bg-[#232323] p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
                <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-vex-muted">Videos completed</span>
                    <span className="text-white">{overall.totalCompletedVideos} / {overall.totalVideos}</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-[#171717]">
                    <div
                        className="h-2 rounded-full bg-vex-primary"
                        style={{ width: `${overall.totalVideos > 0 ? Math.round((overall.totalCompletedVideos / overall.totalVideos) * 100) : 0}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
