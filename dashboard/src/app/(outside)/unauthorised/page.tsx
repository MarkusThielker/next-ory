'use client';

import { ErrorDisplay } from '@/components/error';
import { Button } from '@/components/ui/button';
import { LogoutLink } from '@/ory';
import { LogOut } from 'lucide-react';

export default function UnauthorizedPage() {
    return (
        <div className="bg-background min-h-screen p-16">
            <ErrorDisplay
                title="Unauthorised"
                message="You are unauthorised to access this application!"/>
            <Button className="mt-8 space-x-2" onClick={LogoutLink()}>
                <LogOut className="h-4 w-4"/>
                <span>Logout</span>
            </Button>
        </div>
    );
}
