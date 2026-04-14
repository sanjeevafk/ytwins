'use client';

import { useMemo } from 'react';
import { usePomodoro } from '@/hooks/usePomodoro';

interface FocusTimerProps {
    compact?: boolean;
}

const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export function FocusTimer({ compact }: FocusTimerProps) {
    const { mode, status, secondsLeft, start, pause, reset } = usePomodoro();

    const label = useMemo(() => (mode === 'work' ? 'Focus' : 'Break'), [mode]);
    const isRunning = status === 'running';

    return (
        <div className={`flex items-center gap-3 rounded-full border border-vex-border bg-vex-surface px-3 py-1 ${compact ? 'text-xs' : 'text-sm'}`}>
            <span className="text-vex-muted">{label}</span>
            <span className="font-semibold text-white tabular-nums">{formatTime(secondsLeft)}</span>
            <button
                onClick={isRunning ? pause : start}
                className="rounded-full bg-vex-primary/20 px-2 py-1 text-xs font-semibold text-vex-primary hover:bg-vex-primary/30"
            >
                {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
                onClick={reset}
                className="rounded-full px-2 py-1 text-xs text-vex-muted hover:text-white"
            >
                Reset
            </button>
        </div>
    );
}
