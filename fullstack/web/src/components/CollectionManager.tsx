'use client';

import { useState } from 'react';
import type { Collection } from '@/lib/collections';

interface CollectionManagerProps {
    collections: Collection[];
    onCreateCollection: (name: string) => void;
    onDeleteCollection: (id: number) => void;
}

export function CollectionManager({
    collections,
    onCreateCollection,
    onDeleteCollection,
}: CollectionManagerProps) {
    const [collectionName, setCollectionName] = useState('');

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            <div className="rounded-2xl border border-[#2E2E2E] bg-[#232323] p-6 shadow-xl">
                <h2 className="text-2xl font-semibold text-white">Collections</h2>
                <p className="text-sm text-vex-muted">Group your learning resources.</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                        value={collectionName}
                        onChange={(event) => setCollectionName(event.target.value)}
                        placeholder="New collection name"
                        className="h-10 flex-1 rounded-lg border border-[#2E2E2E] bg-[#171717] px-3 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-vex-primary"
                    />
                    <button
                        onClick={() => {
                            if (!collectionName.trim()) return;
                            onCreateCollection(collectionName.trim());
                            setCollectionName('');
                        }}
                        className="h-10 rounded-lg bg-vex-primary px-4 text-sm font-semibold text-black hover:bg-vex-primaryHover"
                    >
                        Add Collection
                    </button>
                </div>
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                    {collections.length === 0 ? (
                        <p className="text-sm text-gray-400">No collections yet. Create one to get started.</p>
                    ) : (
                        collections.map((collection) => (
                            <div key={collection.id} className="flex justify-between items-center rounded-xl border border-[#2E2E2E] bg-[#171717] p-4">
                                <div>
                                    <p className="text-sm font-semibold text-white">{collection.name}</p>
                                    <p className="text-xs text-vex-muted">Created {new Date(collection.createdAt).toLocaleDateString()}</p>
                                </div>
                                <button 
                                    onClick={() => onDeleteCollection(collection.id)}
                                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
