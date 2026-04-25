'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ShortcutsHelpProps {
    isOpen: boolean;
    onClose: () => void;
}

const shortcuts = [
    { key: 'J', description: 'Next video' },
    { key: 'K', description: 'Previous video' },
    { key: 'Space', description: 'Play or pause' },
    { key: 'F', description: 'Toggle fullscreen' },
    { key: 'N', description: 'Focus notes input' },
    { key: 'T', description: 'Toggle notes sidebar' },
    { key: '?', description: 'Show shortcuts' },
];

export function ShortcutsHelp({ isOpen, onClose }: ShortcutsHelpProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
            <DialogContent className="bg-[#232323] border border-[#2E2E2E] text-gray-100">
                <DialogHeader>
                    <DialogTitle>Keyboard Shortcuts</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3">
                    {shortcuts.map((shortcut) => (
                        <div
                            key={shortcut.key}
                            className="flex items-center justify-between rounded-lg border border-[#2E2E2E] bg-[#171717] px-3 py-2"
                        >
                            <span className="text-sm text-gray-300">{shortcut.description}</span>
                            <span className="rounded-md bg-[#2E2E2E] px-2 py-1 text-xs font-semibold text-gray-100">
                                {shortcut.key}
                            </span>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
