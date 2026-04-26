'use client';

import { useEffect, useRef, useState } from 'react';

export type PomodoroMode = 'work' | 'break';
export type PomodoroStatus = 'idle' | 'running' | 'paused';

export const usePomodoro = (workMinutes = 25, breakMinutes = 5) => {
    const [mode, setMode] = useState<PomodoroMode>('work');
    const [status, setStatus] = useState<PomodoroStatus>('idle');
    const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (status !== 'running') return;

        timerRef.current = window.setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev > 1) return prev - 1;

                const nextMode: PomodoroMode = mode === 'work' ? 'break' : 'work';
                setMode(nextMode);
                return (nextMode === 'work' ? workMinutes : breakMinutes) * 60;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [status, mode, workMinutes, breakMinutes]);

    const start = () => setStatus('running');
    const pause = () => setStatus('paused');
    const reset = () => {
        setStatus('idle');
        setMode('work');
        setSecondsLeft(workMinutes * 60);
    };

    return {
        mode,
        status,
        secondsLeft,
        start,
        pause,
        reset,
    };
};
