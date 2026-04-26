import { Video } from './types';
import { api } from './api';

/**
 * Fetches videos from a YouTube playlist or single video URL
 * This function calls our Ruby backend API
 */
export async function fetchPlaylistVideos(url: string): Promise<Video[]> {
    const response = await api.get<{ videos: Video[] }>(`/youtube/playlist?url=${encodeURIComponent(url)}`);

    if (response.error || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch videos');
    }

    return response.data.videos;
}

/**
 * Fetches metadata for a single YouTube video
 * (Optionally implemented in Ruby if needed, but fetchPlaylistVideos handles single URLs too)
 */
export async function fetchVideoMetadata(videoId: string): Promise<Video> {
    const response = await api.get<{ videos: Video[] }>(`/youtube/playlist?url=${encodeURIComponent(`https://youtube.com/watch?v=${videoId}`)}`);
    if (response.error || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch video');
    }
    return response.data.videos[0];
}
