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
            <SidebarInset className="overflow-hidden space-y-6">
                <header className="flex items-center px-6 pt-6 gap-2">
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
                <div className="flex-1 px-6 pb-6 overflow-scroll">
                    {children}
                </div>
            </SidebarInset>
            <Toaster/>
        </SidebarProvider>
    );
}
