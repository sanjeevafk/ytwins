'use client';

import { useEffect } from 'react';

type ShortcutHandlers = {
    goToNextVideo: () => void;
    goToPreviousVideo: () => void;
    togglePlay: () => void;
    toggleFullscreen: () => void;
    focusNoteInput: () => void;
    toggleNotesSidebar: () => void;
    showShortcutsHelp: () => void;
};

const isEditableTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    const tagName = target.tagName;
    return target.isContentEditable || tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT';
};

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.metaKey || event.ctrlKey || event.altKey) return;
            if (isEditableTarget(event.target)) return;

            switch (event.key) {
                case 'j':
                    handlers.goToNextVideo();
                    break;
                case 'k':
                    handlers.goToPreviousVideo();
                    break;
                case ' ':
                    event.preventDefault();
                    handlers.togglePlay();
                    break;
                case 'f':
                    handlers.toggleFullscreen();
                    break;
                case 'n':
                    handlers.focusNoteInput();
                    break;
                case 't':
                    handlers.toggleNotesSidebar();
                    break;
                case '?':
                    event.preventDefault();
                    handlers.showShortcutsHelp();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlers]);
}
