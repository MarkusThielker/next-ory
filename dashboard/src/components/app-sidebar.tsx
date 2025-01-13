'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { AppWindow, ChartLine, FileLock2, Home, LogOut, LucideIcon, Moon, Sun, Users } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { LogoutLink } from '@/ory';
import React from 'react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarGroup {
    type: 'group';
    label: string;
    items: SidebarItem[];
}

interface SidebarItem {
    type: 'item';
    label: string;
    path: string;
    icon: LucideIcon;
}

type SidebarContent = SidebarItem | SidebarGroup

function renderSidebarMenuItem(item: SidebarItem, key: number, collapsed: boolean) {
    return (
        <Tooltip key={key} delayDuration={500}>
            <TooltipTrigger asChild>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href={item.path}>
                            <item.icon/>
                            <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </TooltipTrigger>
            <TooltipContent side="right" className={collapsed ? '' : 'hidden'}>
                {item.label}
            </TooltipContent>
        </Tooltip>
    );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const { setTheme } = useTheme();

    const { state } = useSidebar();

    const items: SidebarContent[] = [
        {
            label: 'Application',
            type: 'group',
            items: [
                {
                    type: 'item',
                    label: 'Home',
                    path: '/',
                    icon: Home,
                },
                {
                    type: 'item',
                    label: 'Analytics',
                    path: '/analytics',
                    icon: ChartLine,
                },
            ],
        },
        {
            label: 'Ory Kratos',
            type: 'group',
            items: [
                {
                    type: 'item',
                    label: 'Users',
                    path: '/user',
                    icon: Users,
                },
            ],
        },
        {
            label: 'Ory Hydra',
            type: 'group',
            items: [
                {
                    type: 'item',
                    label: 'Clients',
                    path: '/client',
                    icon: AppWindow,
                },
            ],
        },
        {
            label: 'Ory Keto',
            type: 'group',
            items: [
                {
                    type: 'item',
                    label: 'Relations',
                    path: '/relation',
                    icon: FileLock2,
                },
            ],
        },
    ];

    return (
        <Sidebar variant="inset" collapsible="icon" {...props}>
            <SidebarContent>
                <SidebarMenu>
                    {items.map((item, index) => {
                        switch (item.type) {
                            case 'item':
                                return renderSidebarMenuItem(item, index, state === 'collapsed');
                            case 'group':
                                return (
                                    <SidebarGroup key={index}>
                                        <SidebarGroupLabel>{item.label}</SidebarGroupLabel>
                                        {item.items.map((subItem, subIndex) => renderSidebarMenuItem(subItem, subIndex, state === 'collapsed'))}
                                    </SidebarGroup>
                                );
                        }
                    })}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
                                    <Moon
                                        className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
                                    <span>Change Theme</span>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTheme('light')}>
                                    Light
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme('dark')}>
                                    Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme('system')}>
                                    System
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={LogoutLink()}>
                            <LogOut/>
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
