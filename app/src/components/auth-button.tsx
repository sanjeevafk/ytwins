'use client';

import { useState } from 'react';
import { Menu, DownloadCloud, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ExportDialog } from '@/components/ExportDialog';

const STORAGE_KEY = 'youtube-playlist-data';

export function AuthButton() {
    const [exportOpen, setExportOpen] = useState(false);

    const handleClearData = () => {
        if (confirm('Clear all local data? This cannot be undone.')) {
            localStorage.removeItem(STORAGE_KEY);
            window.location.reload();
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Menu className="w-4 h-4 mr-2" />
                        Data
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setExportOpen(true)}>
                        <DownloadCloud className="w-4 h-4 mr-2" />
                        Export Data
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleClearData} className="text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Local Data
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ExportDialog isOpen={exportOpen} onClose={() => setExportOpen(false)} />
        </>
    );
}
