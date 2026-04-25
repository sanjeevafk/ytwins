'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { exportAsHTML, exportAsJSON, exportAsMarkdown } from '@/lib/exporters';

interface ExportDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

type ExportType = 'markdown' | 'html' | 'json';

const exportHandlers: Record<ExportType, () => ReturnType<typeof exportAsMarkdown>> = {
    markdown: exportAsMarkdown,
    html: exportAsHTML,
    json: exportAsJSON,
};

export function ExportDialog({ isOpen, onClose }: ExportDialogProps) {
    const [message, setMessage] = useState('');

    const handleExport = (type: ExportType) => {
        const payload = exportHandlers[type]();
        if (!payload) {
            setMessage('No data available to export.');
            return;
        }

        const blob = new Blob([payload.content], { type: payload.mimeType });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = payload.filename;
        anchor.click();
        URL.revokeObjectURL(url);
        setMessage(`Exported as ${type.toUpperCase()}.`);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
            <DialogContent className="bg-[#232323] border border-[#2E2E2E] text-gray-100">
                <DialogHeader>
                    <DialogTitle>Export Your Data</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    <button
                        onClick={() => handleExport('markdown')}
                        className="w-full rounded-lg border border-[#2E2E2E] bg-[#171717] px-4 py-3 text-left text-sm font-medium text-gray-200 hover:bg-[#2E2E2E]"
                    >
                        Export as Markdown
                    </button>
                    <button
                        onClick={() => handleExport('html')}
                        className="w-full rounded-lg border border-[#2E2E2E] bg-[#171717] px-4 py-3 text-left text-sm font-medium text-gray-200 hover:bg-[#2E2E2E]"
                    >
                        Export as HTML
                    </button>
                    <button
                        onClick={() => handleExport('json')}
                        className="w-full rounded-lg border border-[#2E2E2E] bg-[#171717] px-4 py-3 text-left text-sm font-medium text-gray-200 hover:bg-[#2E2E2E]"
                    >
                        Export as JSON
                    </button>
                    {message && <p className="text-xs text-vex-primary">{message}</p>}
                </div>
            </DialogContent>
        </Dialog>
    );
}
