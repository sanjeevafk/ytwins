'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, Settings, Maximize, Minimize, Monitor } from 'lucide-react';
import { Video } from '@/lib/types';

const YouTube = dynamic(() => import('react-youtube'), { ssr: false });

interface VideoPlayerProps {
    video: Video;
    onComplete: () => void;
    onSkip: () => void;
    onPrevious: () => void;
    onNext: () => void;
    hasPrevious: boolean;
    hasNext: boolean;
    playbackSpeed: number;
    onSpeedChange: (speed: number) => void;
    isFullscreen: boolean;
    onFullscreenChange: (isFullscreen: boolean) => void;
    cinemaMode: boolean;
    onCinemaModeToggle: () => void;
    onPlayerReady?: (player: YouTubePlayer) => void;
}

type YouTubePlayer = {
    setPlaybackRate: (rate: number) => void;
    getPlayerState?: () => number;
    playVideo?: () => void;
    pauseVideo?: () => void;
    seekTo?: (seconds: number, allowSeekAhead?: boolean) => void;
    getCurrentTime?: () => number;
};

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const VideoPlayer = ({
    video,
    onComplete,
    onSkip,
    onPrevious,
    onNext,
    hasNext,
    hasPrevious,
    playbackSpeed,
    onSpeedChange,
    isFullscreen,
    onFullscreenChange,
    cinemaMode,
    onCinemaModeToggle,
    onPlayerReady,
}: VideoPlayerProps) => {
    const [player, setPlayer] = useState<YouTubePlayer | null>(null);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFullscreenNow = document.fullscreenElement !== null;
            onFullscreenChange(isFullscreenNow);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [onFullscreenChange]);

    useEffect(() => {
        if (containerRef.current && isFullscreen) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else if (document.fullscreenElement && !isFullscreen) {
            document.exitFullscreen().catch(err => {
                console.error('Error attempting to exit fullscreen:', err);
            });
        }
    }, [isFullscreen]);

    const handleVideoEnd = () => {
        onComplete();
        if (hasNext) {
            onNext();
        }
    };

    const handleReady = (event: { target: YouTubePlayer }) => {
        setPlayer(event.target);
        event.target.setPlaybackRate(playbackSpeed);
        onPlayerReady?.(event.target);
    };

    const handleSpeedChange = (speed: number) => {
        if (player) {
            player.setPlaybackRate(speed);
        }
        onSpeedChange(speed);
        setShowSpeedMenu(false);
    };

    const toggleFullscreen = () => {
        onFullscreenChange(!isFullscreen);
    };

    return (
        <div ref={containerRef} className={`w-full space-y-4 ${isFullscreen ? 'fixed inset-0 bg-black z-50 p-4' : ''}`}>
            <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden shadow-xl group">
                <YouTube
                    videoId={video.id}
                    className="w-full h-full"
                    opts={{
                        width: '100%',
                        height: '100%',
                        playerVars: {
                            autoplay: 1,
                            modestbranding: 1,
                            rel: 0,
                            controls: 1,
                        },
                    }}
                    onEnd={handleVideoEnd}
                    onReady={handleReady}
                />
                <button
                    onClick={toggleFullscreen}
                    className="absolute top-1/2 right-4 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all z-50 opacity-0 group-hover:opacity-100 shadow-lg hover:scale-110"
                    title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                    {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                </button>
            </div>

            <div className={`p-6 backdrop-blur rounded-xl shadow-lg bg-[#232323] ${isFullscreen ? 'mt-4' : ''}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-200">{video.title}</h2>
                    <div className="flex flex-col items-end gap-2">
                        <button
                            onClick={onCinemaModeToggle}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${cinemaMode ? 'bg-green-600/20 text-green-500' : 'bg-[#171717] hover:bg-[#2E2E2E] text-gray-400'}`}
                            title={cinemaMode ? "Exit Cinema Mode" : "Enter Cinema Mode"}
                        >
                            <Monitor size={16} />
                            <span className="text-sm font-medium">Cinema mode</span>
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors bg-[#171717] hover:bg-[#2E2E2E]"
                            >
                                <Settings size={16} className="text-gray-400" />
                                <span className="text-sm font-medium text-gray-400">{playbackSpeed}x</span>
                            </button>
                            {showSpeedMenu && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-24 py-1 rounded-lg shadow-xl border border-[#2E2E2E] z-20 bg-[#232323]">
                                    {SPEED_OPTIONS.map((speed) => (
                                        <button
                                            key={speed}
                                            onClick={() => handleSpeedChange(speed)}
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-[#2E2E2E] transition-colors ${playbackSpeed === speed ? 'text-green-500' : 'text-gray-400'}`}
                                        >
                                            {speed}x
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={onPrevious}
                        disabled={!hasPrevious}
                        className="flex items-center gap-2 px-6 py-3 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[#171717] border border-[#2E2E2E] hover:bg-[#2E2E2E]"
                    >
                        <ChevronLeft size={20} />
                        Previous
                    </button>

                    <button
                        onClick={() => {
                            onComplete();
                            if (hasNext) {
                                onNext();
                            }
                        }}
                        className="flex items-center gap-2 px-6 py-3 text-white rounded-xl shadow-lg hover:shadow-xl transition-all bg-green-600 hover:bg-green-700"
                    >
                        <CheckCircle size={20} />
                        Mark as Complete
                    </button>

                    <button
                        onClick={onSkip}
                        className="flex items-center gap-2 px-6 py-3 text-white rounded-xl shadow-lg hover:shadow-xl transition-all bg-amber-700 hover:bg-amber-800"
                    >
                        <XCircle size={20} />
                        Skip Video
                    </button>

                    <button
                        onClick={onNext}
                        disabled={!hasNext}
                        className="flex items-center gap-2 px-6 py-3 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[#171717] border border-[#2E2E2E] hover:bg-[#2E2E2E]"
                    >
                        Next
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};
