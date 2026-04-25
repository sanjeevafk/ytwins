import { api } from './api';

export type Collection = {
    id: number;
    name: string;
    createdAt: string;
};

interface RawCollection {
    id: number;
    name: string;
    created_at: string;
}

export const loadCollections = async (): Promise<Collection[]> => {
    const response = await api.get<RawCollection[]>('/collections');
    if (response.error || !response.data) return [];
    return response.data.map(c => ({
        id: c.id,
        name: c.name,
        createdAt: c.created_at
    }));
};

export const createCollection = async (name: string) => {
    return api.post('/collections', { name });
};

export const deleteCollection = async (id: number) => {
    return api.delete(`/collections/${id}`);
};

export const addVideoToCollection = async (collectionId: number, videoId: number) => {
    return api.post(`/collections/${collectionId}/add_video`, { video_id: videoId });
};
