import { PlaylistData } from './types';

const STORAGE_KEY = 'youtube-playlist-data';

interface StorageSchema {
    settings: {
        playbackSpeed: number;
        darkMode: boolean;
        volume?: number;
    };
    playlists: {
        [key: string]: {
            videos: { id: string; completed: boolean }[];
            currentIndex: number;
            lastPlayedId: string;
            updatedAt: number;
        }
    };
}

const throttle = <T extends (...args: Parameters<T>) => ReturnType<T>>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return function (this: unknown, ...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

export const saveToStorage = throttle((data: PlaylistData) => {
    if (typeof window === 'undefined') return;
    try {
        const existingRaw = localStorage.getItem(STORAGE_KEY);
        const storage: StorageSchema = existingRaw ? JSON.parse(existingRaw) : { settings: {}, playlists: {} };
        const playlistId = data.videos.length > 0 ? data.videos[0].id : 'default';

        storage.settings = {
            playbackSpeed: data.playbackSpeed,
            darkMode: data.darkMode,
        };

        storage.playlists[playlistId] = {
            videos: data.videos.map(v => ({ id: v.id, completed: v.completed })),
            currentIndex: data.currentIndex,
            lastPlayedId: data.videos[data.currentIndex]?.id,
            updatedAt: Date.now()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    } catch (error) {
        console.error('Failed to save to local storage', error);
    }
}, 1000);

export const loadFromStorage = (currentPlaylistFirstVideoId?: string): Partial<PlaylistData> | null => {
    if (typeof window === 'undefined') return null;
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return null;

        const storage: StorageSchema = JSON.parse(saved);

        let result: Partial<PlaylistData> = {
            playbackSpeed: storage.settings.playbackSpeed ?? 1,
            darkMode: storage.settings.darkMode ?? true,
        };

        if (currentPlaylistFirstVideoId && storage.playlists[currentPlaylistFirstVideoId]) {
            const pl = storage.playlists[currentPlaylistFirstVideoId];
            result = {
                ...result,
                currentIndex: pl.currentIndex,
            };
        }

        return result;
    } catch (error) {
        console.error('Failed to load from local storage', error);
        return null;
    }
};

export const getStoredVideoStatus = (playlistKey: string) => {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return [];
        const storage: StorageSchema = JSON.parse(saved);
        return storage.playlists[playlistKey]?.videos || [];
    } catch { return []; }
};

export const clearStorage = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
};
