'use client';

import { useRef, useState, useEffect } from 'react';
import type { ChangeEvent, RefObject } from 'react';
import { FileText, Save, FileType, ChevronDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TimestampCapture } from '@/components/TimestampCapture';
import { formatTimestamp } from '@/lib/timestamps';
import { saveNote, loadStoredNotes } from '@/lib/notes';

interface NoteTakerProps {
    videoId: string;
    videoDbId?: number;
    videoTitle: string;
    inputRef?: RefObject<HTMLTextAreaElement | null>;
    onRequestTimestamp?: () => number | null;
}

export const NoteTaker = ({ videoId, videoDbId, videoTitle, inputRef, onRequestTimestamp }: NoteTakerProps) => {
    const internalInputRef = useRef<HTMLTextAreaElement>(null);
    const resolvedInputRef = inputRef ?? internalInputRef;
    const [notes, setNotes] = useState<string>('');
    const [saved, setSaved] = useState(true);
    const [saveMessage, setSaveMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchNote() {
            setIsLoading(true);
            const allNotes = await loadStoredNotes();
            const existing = allNotes.find(n => n.videoId === videoId);
            if (existing) {
                setNotes(existing.content);
            } else {
                setNotes('');
            }
            setIsLoading(false);
            setSaved(true);
        }
        fetchNote();
    }, [videoId]);

    const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
        setSaved(false);
        setSaveMessage('');
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

    const handleSaveBackend = async () => {
        if (!videoDbId) return;
        setSaveMessage('Saving...');
        const response = await saveNote(videoId, notes, 0, videoDbId);
        if (!response.error) {
            setSaved(true);
            setSaveMessage('Saved to cloud');
        } else {
            setSaveMessage('Failed to save');
        }
        setTimeout(() => setSaveMessage(''), 2000);
    };

    const handleExportPDF = () => {
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

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-vex-primary" />
                    <span className="font-semibold text-white whitespace-nowrap">My Notes</span>
                </div>

                <TimestampCapture
                    onCapture={handleCaptureTimestamp}
                    disabled={!onRequestTimestamp}
                />

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
                        <DropdownMenuItem onClick={handleSaveBackend}>
                            <Save className="w-4 h-4 mr-2 text-vex-primary" />
                            Save to Cloud
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportPDF} disabled={!notes.trim()}>
                            <FileType className="w-4 h-4 mr-2 text-red-500" />
                            Export as PDF
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {saveMessage && (
                <div className="text-xs text-vex-primary mb-2 animate-pulse">
                    ✓ {saveMessage}
                </div>
            )}

            <Textarea
                value={notes}
                onChange={handleNotesChange}
                placeholder={isLoading ? "Loading notes..." : "Write your notes here..."}
                ref={resolvedInputRef}
                disabled={isLoading}
                className="flex-1 min-h-[300px] font-mono text-sm resize-none bg-vex-surface border-vex-border text-white placeholder:text-vex-muted/50 focus:border-vex-primary focus:ring-1 focus:ring-vex-primary/30"
            />
        </div>
    );
};
