'use client';

import { ErrorDisplay } from '@/components/error';
import { Button } from '@/components/ui/button';
import { kratos, LogoutLink } from '@/ory';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Session } from '@ory/client';
import { Skeleton } from '@/components/ui/skeleton';

export default function UnauthorizedPage() {

    const [session, setSession] = useState<Session | undefined>(undefined);

    useEffect(() => {
        kratos.toSession()
            .then((response) => setSession(response.data));
    }, []);

    return (
        <div className="bg-background min-h-screen p-16">
            <ErrorDisplay
                title="Unauthorised"
                message="You are unauthorised to access this application!"/>

            {
                session ?
                    <p className="text-xs text-neutral-500">USER ID {session.identity?.id}</p>
                    :
                    <Skeleton className="w-72 h-4"/>
            }

            <Button className="mt-8 space-x-2" onClick={LogoutLink()}>
                <LogOut className="h-4 w-4"/>
                <span>Logout</span>
            </Button>
        </div>
    );
}
