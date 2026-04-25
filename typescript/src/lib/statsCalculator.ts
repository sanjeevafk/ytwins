import type { PlaylistData } from '@/lib/types';
import type { StoredNote } from '@/lib/notes';

const STORAGE_KEY = 'youtube-playlist-data';

type StoredPlaylistEntry = {
    videos: { id: string; completed: boolean }[];
    currentIndex: number;
    lastPlayedId: string;
    updatedAt: number;
};

type StorageSchema = {
    settings: {
        playbackSpeed?: number;
        darkMode?: boolean;
        volume?: number;
    };
    playlists: Record<string, StoredPlaylistEntry>;
};

export type StatsSummary = {
    totalPlaylists: number;
    totalVideos: number;
    totalCompletedVideos: number;
};

export type PlaylistStats = {
    totalVideos: number;
    completedVideos: number;
    completionPercent: number;
    notesCount: number;
    notesPerVideo: number;
};

export const loadStorageSummary = (): StatsSummary => {
    if (typeof window === 'undefined') {
        return { totalPlaylists: 0, totalVideos: 0, totalCompletedVideos: 0 };
    }

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { totalPlaylists: 0, totalVideos: 0, totalCompletedVideos: 0 };

        const parsed = JSON.parse(raw) as StorageSchema;
        const playlists = Object.values(parsed.playlists || {});
        const totalVideos = playlists.reduce((sum, playlist) => sum + playlist.videos.length, 0);
        const totalCompletedVideos = playlists.reduce(
            (sum, playlist) => sum + playlist.videos.filter((video) => video.completed).length,
            0
        );

        return {
            totalPlaylists: playlists.length,
            totalVideos,
            totalCompletedVideos,
        };
    } catch {
        return { totalPlaylists: 0, totalVideos: 0, totalCompletedVideos: 0 };
    }
};

export const calculatePlaylistStats = (playlistData: PlaylistData, notes: StoredNote[]): PlaylistStats => {
    const totalVideos = playlistData.videos.length;
    const completedVideos = playlistData.videos.filter((video) => video.completed).length;
    const completionPercent = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
    const notesCount = notes.length;
    const notesPerVideo = totalVideos > 0 ? Number((notesCount / totalVideos).toFixed(2)) : 0;

    return {
        totalVideos,
        completedVideos,
        completionPercent,
        notesCount,
        notesPerVideo,
    };
};
