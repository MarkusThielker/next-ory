import type { Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import React from 'react';
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'] });

const APP_NAME = 'Next Ory';
const APP_DEFAULT_TITLE = 'Next Ory';
const APP_TITLE_TEMPLATE = `%s | ${APP_DEFAULT_TITLE}`;
const APP_DESCRIPTION = 'Get started with ORY authentication quickly and easily.';

export const metadata = {
    applicationName: APP_NAME,
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: APP_DEFAULT_TITLE,
    },
    formatDetection: {
        telephone: false,
    },
};

export const viewport: Viewport = {
    themeColor: '#0B0908',
    width: 'device-width',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <link crossOrigin="use-credentials" rel="manifest" href="/manifest.json"/>
            <link
                rel="icon"
                href="/favicon.png"
            />
        </head>
        <body className={cn(inter.className)}>
        <main>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
                <Toaster/>
            </ThemeProvider>
        </main>
        </body>
        </html>
    );
}
