'use client';

import { useState, useEffect } from 'react';
import { LogIn, LogOut, User } from 'lucide-react';
import Image from 'next/image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export function AuthButton() {
    const [user, setUser] = useState<{ name: string; avatar_url?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            const userData = await api.getCurrentUser();
            setUser(userData || null);
            setIsLoading(false);
        }
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await api.get('/logout');
        window.location.href = '/';
    };

    const handleLogin = () => {
        window.location.href = '/auth/google';
    };

    if (isLoading) return <div className="w-8 h-8 rounded-full bg-vex-surface animate-pulse" />;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-full">
                    {user?.avatar_url ? (
                        <Image src={user.avatar_url} alt={user.name} width={36} height={36} className="h-9 w-9 rounded-full" />
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-vex-surface">
                            <User className="h-5 w-5 text-vex-muted" />
                        </div>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                {user ? (
                    <>
                        <div className="flex items-center justify-start gap-2 p-2">
                            <div className="flex flex-col space-y-1 leading-none">
                                <p className="font-medium text-white">{user.name}</p>
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-400">
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </DropdownMenuItem>
                    </>
                ) : (
                    <DropdownMenuItem onClick={handleLogin}>
                        <LogIn className="w-4 h-4 mr-2" />
                        Login with Google
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
