'use server';

import React from 'react';
import { ThemeToggle } from '@/components/themeToggle';
import { LogoutButton } from '@/components/auth/logout';

export default async function Page() {
    return (
        <div className="flex flex-col min-h-screen items-center text-3xl relative space-y-4">
            <div className="absolute flex flex-row w-fit items-center space-x-4 top-4 right-4">
                <ThemeToggle/>
                <LogoutButton/>
            </div>
        </div>
    );
}
