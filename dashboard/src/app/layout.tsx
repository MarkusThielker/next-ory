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
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider>
                <AppSidebar className="mx-1"/>
                <SidebarInset className="p-2">
                    <header className="flex h-16 shrink-0 items-center gap-2 px-4">
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
                    <div className="flex flex-col p-4 pt-0">
                        {children}
                        <Toaster/>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
