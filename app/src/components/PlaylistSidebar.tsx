'use client';

import { memo } from 'react';
import Image from 'next/image';
import { Video } from '@/lib/types';
import { CheckCircle, PlayCircle } from 'lucide-react';

interface PlaylistSidebarProps {
    videos: Video[];
    currentIndex: number;
    onVideoSelect: (index: number) => void;
    playlistTitle?: string;
}

export const PlaylistSidebar = memo(({ videos, currentIndex, onVideoSelect, playlistTitle }: PlaylistSidebarProps) => {
    const title = playlistTitle ? `${playlistTitle} (${videos.length})` : `Playlist Videos (${videos.length})`;

    return (
        <div className="w-full h-[600px] backdrop-blur rounded-xl shadow-lg overflow-hidden flex flex-col bg-[#232323]">
            <div className="p-4 flex-shrink-0 bg-green-600">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <PlayCircle size={20} />
                    {title}
                </h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {videos.map((video, index) => (
                    <div key={video.id} className="px-2 py-1">
                        <button
                            onClick={() => onVideoSelect(index)}
                            className={`w-full p-2 flex items-start gap-3 transition-colors rounded-lg ${currentIndex === index ? 'bg-green-500/10' : ''
                                }`}
                        >
                            <div className="relative flex-shrink-0 group">
                                <Image
                                    src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                                    alt={video.title}
                                    width={96}
                                    height={64}
                                    className="w-24 h-16 object-cover rounded-md shadow-sm"
                                    unoptimized
                                />
                                {video.completed ? (
                                    <div className="absolute top-1 right-1 rounded-full p-0.5 shadow-sm bg-green-500">
                                        <CheckCircle size={12} className="text-white" />
                                    </div>
                                ) : currentIndex === index && (
                                    <div className="absolute inset-0 bg-black/40 rounded-md flex items-center justify-center">
                                        <PlayCircle size={20} className="text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <p className={`text-xs font-medium line-clamp-2 ${currentIndex === index ? 'text-green-500' : 'text-gray-200'}`}>
                                    {video.title}
                                </p>
                                <p className={`text-[10px] mt-1 ${video.completed ? 'text-green-500' : index === currentIndex ? 'text-green-500' : 'text-gray-400'}`}>
                                    {video.completed ? 'Completed' : index === currentIndex ? 'Now Playing' : 'Not Started'}
                                </p>
                            </div>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
});

PlaylistSidebar.displayName = 'PlaylistSidebar';
