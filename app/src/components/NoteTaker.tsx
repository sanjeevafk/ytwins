'use client';

import { useRef, useState } from 'react';
import type { ChangeEvent, RefObject } from 'react';
import { FileText, Save, FileType, ChevronDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TimestampCapture } from '@/components/TimestampCapture';
import { formatTimestamp } from '@/lib/timestamps';

interface NoteTakerProps {
    videoId: string;
    videoTitle: string;
    inputRef?: RefObject<HTMLTextAreaElement | null>;
    onRequestTimestamp?: () => number | null;
}

interface NoteData {
    content: string;
    title: string;
    updatedAt: string;
    createdAt?: string;
    videoId: string;
}

const NOTES_STORAGE_KEY = 'video_notes_';

export const NoteTaker = ({ videoId, videoTitle, inputRef, onRequestTimestamp }: NoteTakerProps) => {
    const internalInputRef = useRef<HTMLTextAreaElement>(null);
    const resolvedInputRef = inputRef ?? internalInputRef;
    const [notes, setNotes] = useState<string>(() => {
        if (typeof window === 'undefined') return '';
        const savedData = localStorage.getItem(`${NOTES_STORAGE_KEY}${videoId}`);
        if (savedData) {
            try {
                const parsed: NoteData = JSON.parse(savedData);
                return parsed.content || '';
            } catch {
                return savedData;
            }
        }
        return '';
    });
    const [createdAt] = useState<string>(() => {
        if (typeof window === 'undefined') return new Date().toISOString();
        const savedData = localStorage.getItem(`${NOTES_STORAGE_KEY}${videoId}`);
        if (!savedData) return new Date().toISOString();
        try {
            const parsed: NoteData = JSON.parse(savedData);
            return parsed.createdAt || parsed.updatedAt || new Date().toISOString();
        } catch {
            return new Date().toISOString();
        }
    });
    const [saved, setSaved] = useState(true);
    const [saveMessage, setSaveMessage] = useState('');

    const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
        setSaved(false);
        setSaveMessage('');
    };

    const saveToLocalStorage = () => {
        const noteData: NoteData = {
            content: notes,
            title: videoTitle,
            updatedAt: new Date().toISOString(),
            createdAt,
            videoId
        };
        localStorage.setItem(`${NOTES_STORAGE_KEY}${videoId}`, JSON.stringify(noteData));
        setSaved(true);
    };

    const insertTimestamp = (timestamp: string) => {
        const textarea = resolvedInputRef.current;
        if (!textarea) {
            setNotes((prev) => `${prev}${prev.endsWith(' ') || prev.length === 0 ? '' : ' '}${timestamp}`);
            return;
        }

        const start = textarea.selectionStart ?? notes.length;
        const end = textarea.selectionEnd ?? notes.length;
        const before = notes.slice(0, start);
        const after = notes.slice(end);
        const nextValue = `${before}${timestamp}${after}`;

        setNotes(nextValue);
        requestAnimationFrame(() => {
            textarea.focus();
            const cursor = start + timestamp.length;
            textarea.setSelectionRange(cursor, cursor);
        });
    };

    const handleCaptureTimestamp = () => {
        const seconds = onRequestTimestamp?.();
        if (seconds === null || seconds === undefined) return;
        const formatted = formatTimestamp(seconds);
        insertTimestamp(`@ ${formatted}`);
        setSaved(false);
    };

    const handleSaveLocally = () => {
        saveToLocalStorage();
        setSaveMessage('Saved locally');
        setTimeout(() => setSaveMessage(''), 2000);
    };

    const handleExportPDF = () => {
        saveToLocalStorage();
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(videoTitle, 20, 20);
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
        doc.setFontSize(12);
        const splitText = doc.splitTextToSize(notes, 170);
        doc.text(splitText, 20, 40);
        doc.save(`notes-${videoId}.pdf`);
        setSaveMessage('Exported as PDF');
        setTimeout(() => setSaveMessage(''), 2000);
    };

    const handleExportTXT = () => {
        saveToLocalStorage();
        const blob = new Blob([notes], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notes-${videoId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setSaveMessage('Exported as TXT');
        setTimeout(() => setSaveMessage(''), 2000);
    };

    const handleExportMD = () => {
        saveToLocalStorage();
        const blob = new Blob([`# ${videoTitle}\n\n${notes}`], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notes-${videoId}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setSaveMessage('Exported as Markdown');
        setTimeout(() => setSaveMessage(''), 2000);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-vex-primary" />
                    <span className="font-semibold text-white whitespace-nowrap">My Notes</span>
                </div>

                <TimestampCapture
                    onCapture={handleCaptureTimestamp}
                    disabled={!onRequestTimestamp}
                />

                {/* Save Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${saved
                                    ? 'bg-vex-surface text-vex-muted hover:bg-vex-surfaceHover hover:text-white'
                                    : 'bg-vex-primary text-black hover:bg-vex-primaryHover'
                                }`}
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save</span>
                            <ChevronDown className="w-3 h-3" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={handleSaveLocally}>
                            <Save className="w-4 h-4 mr-2 text-vex-primary" />
                            Save Locally
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportPDF} disabled={!notes.trim()}>
                            <FileType className="w-4 h-4 mr-2 text-red-500" />
                            Export as PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportTXT} disabled={!notes.trim()}>
                            <FileText className="w-4 h-4 mr-2 text-blue-500" />
                            Export as TXT
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportMD} disabled={!notes.trim()}>
                            <FileText className="w-4 h-4 mr-2 text-purple-500" />
                            Export as MD
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Status Message */}
            {saveMessage && (
                <div className="text-xs text-vex-primary mb-2 animate-pulse">
                    ✓ {saveMessage}
                </div>
            )}

            {/* Textarea */}
            <Textarea
                value={notes}
                onChange={handleNotesChange}
                placeholder="Write your notes here..."
                ref={resolvedInputRef}
                className="flex-1 min-h-[300px] font-mono text-sm resize-none bg-vex-surface border-vex-border text-white placeholder:text-vex-muted/50 focus:border-vex-primary focus:ring-1 focus:ring-vex-primary/30"
            />
        </div>
    );
};
