import { api } from './api';

export type StoredNote = {
    id: number;
    content: string;
    title: string;
    updatedAt: string;
    createdAt: string;
    videoId: string; // This will map to youtube_id from the backend
    timestamp_seconds: number;
};

interface RawNote {
    id: number;
    content: string;
    title?: string;
    updated_at: string;
    created_at: string;
    youtube_id: string;
    timestamp_seconds: number;
}

export const loadStoredNotes = async (): Promise<StoredNote[]> => {
    const response = await api.get<RawNote[]>('/notes');
    if (response.error || !response.data) return [];

    return response.data.map(n => ({
        id: n.id,
        content: n.content,
        title: n.title || 'Untitled Note',
        updatedAt: n.updated_at,
        createdAt: n.created_at,
        videoId: n.youtube_id,
        timestamp_seconds: n.timestamp_seconds,
    }));
};

export const saveNote = async (videoId: string, content: string, timestamp_seconds: number, video_id_db: number) => {
    return api.post('/notes', {
        video_id: video_id_db,
        content,
        timestamp_seconds
    });
};

export const deleteNote = async (id: number) => {
    return api.delete(`/notes/${id}`);
};
