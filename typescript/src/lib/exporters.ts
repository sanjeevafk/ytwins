const NOTES_PREFIX = 'video_notes_';
const STORAGE_KEY = 'youtube-playlist-data';

type NoteExport = {
    key: string;
    content: string;
    title: string;
    updatedAt: string;
    createdAt?: string;
    videoId: string;
};

type StorageExport = Record<string, unknown> | null;

export type ExportPayload = {
    content: string;
    filename: string;
    mimeType: string;
};

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const loadNotes = (): NoteExport[] => {
    const loadedNotes: NoteExport[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(NOTES_PREFIX)) continue;

        const raw = localStorage.getItem(key);
        if (!raw) continue;

        try {
            const parsed = JSON.parse(raw) as Partial<NoteExport>;
            if (!parsed.content) continue;
            loadedNotes.push({
                key,
                content: parsed.content,
                title: parsed.title || 'Untitled Note',
                updatedAt: parsed.updatedAt || new Date().toISOString(),
                createdAt: parsed.createdAt,
                videoId: parsed.videoId || key.replace(NOTES_PREFIX, ''),
            });
        } catch {
            loadedNotes.push({
                key,
                content: raw,
                title: 'Untitled Note',
                updatedAt: new Date().toISOString(),
                videoId: key.replace(NOTES_PREFIX, ''),
            });
        }
    }

    return loadedNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

const loadStorage = (): StorageExport => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as StorageExport;
    } catch {
        return null;
    }
};

export const exportAsMarkdown = (): ExportPayload | null => {
    const notes = loadNotes();
    const storage = loadStorage();
    if (notes.length === 0 && !storage) return null;

    const lines: string[] = [];
    lines.push('# VexTube Notes Export');
    lines.push('');
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    lines.push('');

    if (notes.length > 0) {
        notes.forEach((note) => {
            lines.push(`## ${note.title}`);
            lines.push('');
            lines.push(`- Video ID: ${note.videoId}`);
            lines.push(`- Updated: ${note.updatedAt}`);
            if (note.createdAt) {
                lines.push(`- Created: ${note.createdAt}`);
            }
            lines.push('');
            lines.push('```');
            lines.push(note.content);
            lines.push('```');
            lines.push('');
        });
    }

    if (storage) {
        lines.push('---');
        lines.push('');
        lines.push('## Playlist Progress');
        lines.push('');
        lines.push('```json');
        lines.push(JSON.stringify(storage, null, 2));
        lines.push('```');
    }

    return {
        content: lines.join('\n'),
        filename: `vextube-export-${Date.now()}.md`,
        mimeType: 'text/markdown',
    };
};

export const exportAsHTML = (): ExportPayload | null => {
    const notes = loadNotes();
    const storage = loadStorage();
    if (notes.length === 0 && !storage) return null;

    const noteSections = notes.map((note) => {
        const content = escapeHtml(note.content);
        return `
            <section class="note">
                <h2>${escapeHtml(note.title)}</h2>
                <p class="meta">Video ID: ${escapeHtml(note.videoId)}</p>
                <p class="meta">Updated: ${escapeHtml(note.updatedAt)}</p>
                ${note.createdAt ? `<p class="meta">Created: ${escapeHtml(note.createdAt)}</p>` : ''}
                <pre>${content}</pre>
            </section>
        `;
    }).join('\n');

    const storageSection = storage
        ? `
            <section class="storage">
                <h2>Playlist Progress</h2>
                <pre>${escapeHtml(JSON.stringify(storage, null, 2))}</pre>
            </section>
        `
        : '';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>VexTube Export</title>
<style>
body { font-family: Arial, sans-serif; background: #0f0f0f; color: #f1f1f1; margin: 0; padding: 32px; }
h1 { margin-bottom: 12px; }
section { background: #1a1a1a; border: 1px solid #2e2e2e; padding: 16px; border-radius: 12px; margin-bottom: 16px; }
.meta { color: #9ca3af; font-size: 12px; margin: 4px 0; }
pre { white-space: pre-wrap; background: #0c0c0c; padding: 12px; border-radius: 8px; border: 1px solid #2e2e2e; }
</style>
</head>
<body>
<h1>VexTube Notes Export</h1>
<p>Generated: ${escapeHtml(new Date().toLocaleString())}</p>
${noteSections}
${storageSection}
</body>
</html>`;

    return {
        content: html,
        filename: `vextube-export-${Date.now()}.html`,
        mimeType: 'text/html',
    };
};

export const exportAsJSON = (): ExportPayload | null => {
    const notes = loadNotes();
    const storage = loadStorage();
    if (notes.length === 0 && !storage) return null;

    const payload = {
        exportedAt: new Date().toISOString(),
        storage,
        notes,
    };

    return {
        content: JSON.stringify(payload, null, 2),
        filename: `vextube-export-${Date.now()}.json`,
        mimeType: 'application/json',
    };
};
