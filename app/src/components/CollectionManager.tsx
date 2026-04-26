'use client';

import { useMemo, useState } from 'react';
import type { Collection, PlaylistMeta } from '@/lib/collections';

interface CollectionManagerProps {
    collections: Collection[];
    playlistMeta: Record<string, PlaylistMeta>;
    onCreateCollection: (name: string) => void;
    onAssignPlaylist: (playlistId: string, collectionId: string | null) => void;
    onToggleFavorite: (playlistId: string) => void;
}

export function CollectionManager({
    collections,
    playlistMeta,
    onCreateCollection,
    onAssignPlaylist,
    onToggleFavorite,
}: CollectionManagerProps) {
    const [collectionName, setCollectionName] = useState('');

    const playlists = useMemo(
        () => Object.values(playlistMeta).sort((a, b) => a.name.localeCompare(b.name)),
        [playlistMeta]
    );

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            <div className="rounded-2xl border border-[#2E2E2E] bg-[#232323] p-6 shadow-xl">
                <h2 className="text-2xl font-semibold text-white">Collections</h2>
                <p className="text-sm text-focus-muted">Group playlists and pin favorites.</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                        value={collectionName}
                        onChange={(event) => setCollectionName(event.target.value)}
                        placeholder="New collection name"
                        className="h-10 flex-1 rounded-lg border border-[#2E2E2E] bg-[#171717] px-3 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-focus-primary"
                    />
                    <button
                        onClick={() => {
                            if (!collectionName.trim()) return;
                            onCreateCollection(collectionName.trim());
                            setCollectionName('');
                        }}
                        className="h-10 rounded-lg bg-focus-primary px-4 text-sm font-semibold text-black hover:bg-focus-primaryHover"
                    >
                        Add Collection
                    </button>
                </div>
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                    {collections.length === 0 ? (
                        <p className="text-sm text-gray-400">No collections yet. Create one to get started.</p>
                    ) : (
                        collections.map((collection) => (
                            <div key={collection.id} className="rounded-xl border border-[#2E2E2E] bg-[#171717] p-4">
                                <p className="text-sm font-semibold text-white">{collection.name}</p>
                                <p className="text-xs text-focus-muted">{collection.playlistIds.length} playlists</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="rounded-2xl border border-[#2E2E2E] bg-[#232323] p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-white">Playlists</h3>
                <div className="mt-4 space-y-3">
                    {playlists.length === 0 ? (
                        <p className="text-sm text-gray-400">Load a playlist to start organizing.</p>
                    ) : (
                        playlists.map((playlist) => (
                            <div
                                key={playlist.id}
                                className="flex flex-col gap-3 rounded-xl border border-[#2E2E2E] bg-[#171717] p-4 md:flex-row md:items-center md:justify-between"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-white">{playlist.name}</p>
                                    <p className="text-xs text-focus-muted">{playlist.collectionId ? `Collection: ${collections.find((c) => c.id === playlist.collectionId)?.name ?? 'Unknown'}` : 'Unassigned'}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => onToggleFavorite(playlist.id)}
                                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${playlist.isFavorite ? 'border-focus-primary bg-focus-primary/10 text-focus-primary' : 'border-[#2E2E2E] text-gray-300'}`}
                                    >
                                        {playlist.isFavorite ? 'Favorited' : 'Favorite'}
                                    </button>
                                    <select
                                        value={playlist.collectionId ?? ''}
                                        onChange={(event) => onAssignPlaylist(playlist.id, event.target.value || null)}
                                        className="h-9 rounded-md border border-[#2E2E2E] bg-[#171717] px-2 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-focus-primary"
                                    >
                                        <option value="">Unassigned</option>
                                        {collections.map((collection) => (
                                            <option key={collection.id} value={collection.id}>
                                                {collection.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
