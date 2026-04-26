'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

interface ResizableSidebarProps {
    children: ReactNode;
    side: 'left' | 'right';
    defaultWidth: number;
    minWidth: number;
    maxWidth: number;
    storageKey: string;
    className?: string;
}

export const ResizableSidebar = ({
    children,
    side,
    defaultWidth,
    minWidth,
    maxWidth,
    storageKey,
    className = '',
}: ResizableSidebarProps) => {
    const [width, setWidth] = useState<number>(() => {
        if (typeof window === 'undefined') return defaultWidth;
        const stored = localStorage.getItem(storageKey);
        return stored ? Math.min(Math.max(parseInt(stored, 10), minWidth), maxWidth) : defaultWidth;
    });
    const [isResizing, setIsResizing] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !sidebarRef.current) return;

            const sidebarRect = sidebarRef.current.getBoundingClientRect();
            let newWidth: number;

            if (side === 'left') {
                newWidth = e.clientX - sidebarRect.left;
            } else {
                newWidth = sidebarRect.right - e.clientX;
            }

            // Clamp width
            newWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
            setWidth(newWidth);
        };

        const handleMouseUp = () => {
            if (isResizing) {
                setIsResizing(false);
                localStorage.setItem(storageKey, width.toString());
            }
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isResizing, side, minWidth, maxWidth, storageKey, width]);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    };

    return (
        <div
            ref={sidebarRef}
            className={`relative shrink-0 ${className}`}
            style={{ width: `${width}px` }}
        >
            {children}

            {/* Resize Handle - Always visible indicator */}
            <div
                onMouseDown={handleMouseDown}
                className={`absolute top-0 ${side === 'left' ? '-right-1' : '-left-1'} w-3 h-full cursor-ew-resize z-30 group`}
            >
                {/* Visible drag indicator line */}
                <div
                    className={`absolute ${side === 'left' ? 'right-0' : 'left-0'} top-0 w-[3px] h-full transition-all duration-150 ${isResizing
                            ? 'bg-vex-primary shadow-[0_0_8px_rgba(0,224,115,0.5)]'
                            : 'bg-vex-border/50 group-hover:bg-vex-primary/70'
                        }`}
                />

                {/* Center grip indicator */}
                <div
                    className={`absolute ${side === 'left' ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 w-[3px] h-16 rounded-full transition-all duration-150 ${isResizing
                            ? 'bg-vex-primary'
                            : 'bg-vex-muted/30 group-hover:bg-vex-primary/50'
                        }`}
                />

                {/* Dots pattern for grip */}
                <div className={`absolute ${side === 'left' ? 'right-[1px]' : 'left-[1px]'} top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isResizing ? 'opacity-100' : ''}`}>
                    <div className="w-[2px] h-[2px] rounded-full bg-vex-muted" />
                    <div className="w-[2px] h-[2px] rounded-full bg-vex-muted" />
                    <div className="w-[2px] h-[2px] rounded-full bg-vex-muted" />
                </div>
            </div>
        </div>
    );
};
