import { NextRequest, NextResponse } from 'next/server';

export const runtime = "nodejs";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

interface YouTubeVideoResponse {
    items: Array<{
        id: string;
        snippet: {
            title: string;
            description: string;
            channelTitle: string;
            publishedAt: string;
            thumbnails: {
                default?: { url: string };
                medium?: { url: string };
                high?: { url: string };
            };
        };
        contentDetails?: {
            duration: string;
        };
    }>;
}

/**
 * GET /api/youtube/video?id=<video_id>
 * Fetches metadata for a single YouTube video
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
    const videoId = searchParams.get('id');

    if (!videoId) {
        return NextResponse.json(
            { error: 'Video ID parameter is required' },
            { status: 400 }
        );
    }

    try {
        const params = new URLSearchParams({
            part: 'snippet,contentDetails',
            id: videoId,
            key: YOUTUBE_API_KEY,
        });

        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?${params}`,
            { next: { revalidate: 3600 } } // Cache for 1 hour
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to fetch video');
        }

        const data: YouTubeVideoResponse = await response.json();
        const video = data.items[0];

        if (!video) {
            return NextResponse.json(
                { error: 'Video not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            channelTitle: video.snippet.channelTitle,
            publishedAt: video.snippet.publishedAt,
            thumbnail: video.snippet.thumbnails.high?.url ||
                video.snippet.thumbnails.medium?.url ||
                video.snippet.thumbnails.default?.url,
            duration: video.contentDetails?.duration,
        });
    } catch (error) {
        console.error('YouTube API error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch video' },
            { status: 500 }
        );
    }
}
