'use client';

import { Clock } from 'lucide-react';

interface TimestampCaptureProps {
    onCapture: () => void;
    disabled?: boolean;
}

export function TimestampCapture({ onCapture, disabled }: TimestampCaptureProps) {
    return (
        <button
            type="button"
            onClick={onCapture}
            disabled={disabled}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-[#171717] hover:bg-[#2E2E2E] text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Insert timestamp"
        >
            <Clock className="w-3.5 h-3.5" />
            Timestamp
        </button>
    );
}
