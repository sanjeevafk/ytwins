export type StoredNote = {
    key: string;
    content: string;
    title: string;
    updatedAt: string;
    createdAt?: string;
    videoId: string;
};

export const NOTES_PREFIX = 'video_notes_';

export const loadStoredNotes = (): StoredNote[] => {
    if (typeof window === 'undefined') return [];
    const loadedNotes: StoredNote[] = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(NOTES_PREFIX)) continue;

        const raw = localStorage.getItem(key);
        if (!raw) continue;

        try {
            const parsed = JSON.parse(raw) as Partial<StoredNote>;
            if (!parsed.content) continue;
            loadedNotes.push({
                key,
                content: parsed.content,
                title: parsed.title || 'Untitled Note',
                updatedAt: parsed.updatedAt || new Date().toISOString(),
                createdAt: parsed.createdAt,
                videoId: parsed.videoId || key.replace(NOTES_PREFIX, ''),
            });
        } catch {
            loadedNotes.push({
                key,
                content: raw,
                title: 'Untitled Note',
                updatedAt: new Date().toISOString(),
                videoId: key.replace(NOTES_PREFIX, ''),
            });
        }
    }

    return loadedNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};
