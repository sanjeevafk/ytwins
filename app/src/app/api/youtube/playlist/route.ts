import { NextRequest, NextResponse } from 'next/server';

export const runtime = "nodejs";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

interface YouTubePlaylistItem {
    snippet: {
        title: string;
        resourceId: {
            videoId: string;
        };
    };
}

interface YouTubeVideoItem {
    id: string;
    snippet: {
        title: string;
    };
}

// Validate YouTube API key on startup
if (!YOUTUBE_API_KEY) {
    console.error('YOUTUBE_API_KEY environment variable is not set');
}

/**
 * Extract playlist ID from YouTube URL
 */
function extractPlaylistId(url: string): string | null {
    const patterns = [
        /[?&]list=([a-zA-Z0-9_-]+)/,
        /youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

/**
 * Extract video ID from YouTube URL
 */
function extractVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

/**
 * Fetch all videos from a YouTube playlist
 */
async function fetchPlaylistVideos(playlistId: string): Promise<{ id: string; title: string; completed: boolean }[]> {
    const videos: { id: string; title: string; completed: boolean }[] = [];
    let nextPageToken: string | undefined;

    do {
        const params = new URLSearchParams({
            part: 'snippet',
            playlistId,
            maxResults: '50',
            key: YOUTUBE_API_KEY!,
        });

        if (nextPageToken) {
            params.set('pageToken', nextPageToken);
        }

        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?${params}`,
            { next: { revalidate: 3600 } } // Cache for 1 hour
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to fetch playlist');
        }

        const data = await response.json();

        for (const item of data.items as YouTubePlaylistItem[]) {
            if (item.snippet.resourceId.videoId) {
                videos.push({
                    id: item.snippet.resourceId.videoId,
                    title: item.snippet.title,
                    completed: false,
                });
            }
        }

        nextPageToken = data.nextPageToken;
    } while (nextPageToken);

    return videos;
}

/**
 * Fetch a single video's details
 */
async function fetchVideoDetails(videoId: string): Promise<{ id: string; title: string; completed: boolean }> {
    const params = new URLSearchParams({
        part: 'snippet',
        id: videoId,
        key: YOUTUBE_API_KEY!,
    });

    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?${params}`,
        { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch video');
    }

    const data = await response.json();
    const video = data.items[0] as YouTubeVideoItem;

    if (!video) {
        throw new Error('Video not found');
    }

    return {
        id: video.id,
        title: video.snippet.title,
        completed: false,
    };
}

/**
 * GET /api/youtube/playlist?url=<youtube_url>
 * Fetches videos from a YouTube playlist or single video URL
 */
export async function GET(request: NextRequest) {
    // Fail fast if API key is not configured
    if (!YOUTUBE_API_KEY) {
        return NextResponse.json(
            { error: 'YouTube API key is not configured on the server' },
            { status: 500 }
        );
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json(
            { error: 'URL parameter is required' },
            { status: 400 }
        );
    }

    try {
        // Try to extract playlist ID first
        const playlistId = extractPlaylistId(url);

        if (playlistId) {
            const videos = await fetchPlaylistVideos(playlistId);
            return NextResponse.json({ videos });
        }

        // Try to extract video ID for single video
        const videoId = extractVideoId(url);

        if (videoId) {
            const video = await fetchVideoDetails(videoId);
            return NextResponse.json({ videos: [video] });
        }

        return NextResponse.json(
            { error: 'Invalid YouTube URL. Please provide a valid video or playlist URL.' },
            { status: 400 }
        );
    } catch (error) {
        console.error('YouTube API error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch videos' },
            { status: 500 }
        );
    }
}
