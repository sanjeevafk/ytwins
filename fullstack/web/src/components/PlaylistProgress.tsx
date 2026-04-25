'use client';

import { Video } from '@/lib/types';

interface PlaylistProgressProps {
    videos: Video[];
    currentIndex: number;
}

export const PlaylistProgress = ({ videos, currentIndex }: PlaylistProgressProps) => {
    const completedCount = videos.filter(v => v.completed).length;
    const progress = (completedCount / videos.length) * 100;

    return (
        <div className="w-full max-w-4xl mx-auto mb-8 p-4 backdrop-blur rounded-xl shadow-lg bg-[#232323]">
            <div className="flex justify-between mb-3 text-sm font-medium">
                <span className="text-green-500">
                    Progress: {completedCount}/{videos.length} videos
                </span>
                <span className="text-gray-400">
                    Video {currentIndex + 1} of {videos.length}
                </span>
                <span className="text-green-500">
                    {Math.round(progress)}% Complete
                </span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden shadow-inner bg-[#171717]">
                <div
                    className="h-full transition-all duration-500 ease-out bg-green-500"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};
