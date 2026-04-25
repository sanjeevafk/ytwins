import { Video } from './types';

/**
 * Fetches videos from a YouTube playlist or single video URL
 * This function calls the server-side API route to avoid exposing API keys
 */
export async function fetchPlaylistVideos(url: string): Promise<Video[]> {
    const response = await fetch(`/api/youtube/playlist?url=${encodeURIComponent(url)}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch videos');
    }

    const data = await response.json();
    return data.videos;
}

/**
 * Fetches metadata for a single YouTube video
 * This function calls the server-side API route to avoid exposing API keys
 */
export async function fetchVideoMetadata(videoId: string): Promise<{
    id: string;
    title: string;
    description: string;
    channelTitle: string;
    publishedAt: string;
    thumbnail: string;
    duration: string;
}> {
    const response = await fetch(`/api/youtube/video?id=${encodeURIComponent(videoId)}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch video');
    }

    return response.json();
}
