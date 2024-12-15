import '../globals.css';
import { Toaster } from '@/components/ui/sonner';
import React from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';

export default function InsideLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
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
            <Toaster/>
        </SidebarProvider>
    );
}
