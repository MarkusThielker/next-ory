import { ThemeToggle } from '@/components/themeToggle';
import React from 'react';

export default function FlowLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center relative space-y-4">
            <div className="absolute flex items-center space-x-4 top-4 right-4">
                <ThemeToggle/>
            </div>
            {children}
        </div>
    );
}