'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoutLink } from '@/ory';

export function LogoutButton() {

    const onLogout = LogoutLink();

    return (
        <Button variant="outline" size="icon" onClick={onLogout}>
            <LogOut className="h-[1.2rem] w-[1.2rem]"/>
        </Button>
    );
}
