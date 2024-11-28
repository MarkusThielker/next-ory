'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { kratos, LogoutLink } from '@/ory';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/themeToggle';
import { Session } from '@ory/client';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Page() {

    const router = useRouter();

    const [session, setSession] = useState<Session>();
    const loadSession = useCallback(async () => {
        console.log(kratos.toSession());
        return kratos.toSession();
    }, [router]);

    useEffect(() => {

        if (session) {
            return;
        }

        loadSession()
            .then((response) => {
                console.log(response.data);
                response.data && setSession(response.data);
            })
            .catch(() => {
                const authentication_url = process.env.NEXT_PUBLIC_AUTHENTICATION_NODE_URL;
                const dashboard_url = process.env.NEXT_PUBLIC_AUTHENTICATION_NODE_URL;
                authentication_url && dashboard_url &&
                router.push(authentication_url + '/flow/login?return_to=' + dashboard_url);
            });

    }, [router, session]);

    const onLogout = LogoutLink();

    return (
        <div className="flex flex-col min-h-screen items-center text-3xl relative space-y-4">
            <div className="absolute flex flex-row w-fit items-center space-x-4 top-4 right-4">
                <ThemeToggle/>
                <Button variant="outline" size="icon" onClick={onLogout}>
                    <LogOut className="h-[1.2rem] w-[1.2rem]"/>
                </Button>
            </div>
        </div>
    );
}
