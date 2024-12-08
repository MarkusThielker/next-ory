import type { Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import React from 'react';
import { ThemeProvider } from 'next-themes';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';

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
    themeColor: '#18181b',
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
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider className="max-h-screen min-h-screen">
                <AppSidebar className="mx-1"/>
                <SidebarInset className="overflow-hidden p-6 space-y-6">
                    <header className="flex h-4 items-center gap-2">
                        <SidebarTrigger className="-ml-1 p-1"/>
                        <Separator orientation="vertical" className="mr-2 h-4"/>
                        {
                            // TODO: implement dynamic Breadcrumbs
                        }
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/">
                                        Ory Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </header>
                    <div className="flex-1 overflow-scroll">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
            <Toaster/>
        </ThemeProvider>
        </body>
        </html>
    );
}
