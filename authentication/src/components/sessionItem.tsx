'use client';

import React, { useState } from 'react';
import { Session, SessionDevice } from '@ory/client';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UAParser } from 'ua-parser-js';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SessionItemProps {
    session: Session;
    showInvalidate: boolean;
    invalidateSession: (id: string) => void;
}

export default function SessionItem({ session, showInvalidate, invalidateSession }: SessionItemProps) {

    if (!session.devices || session.devices.length < 1) {
        return;
    }

    const [device] = useState<SessionDevice>(session.devices[0]);

    const parser = new UAParser(device.user_agent);
    const result = parser.getResult();

    return (
        <Card className="relative w-full">
            <CardHeader>
                <CardTitle>
                    {result.os.name}
                </CardTitle>
                <CardDescription>
                    {result.browser.name}, version {result.browser.version} <br/>
                    Signed in since {new Date(session.authenticated_at!!).toLocaleString()}
                </CardDescription>
            </CardHeader>
            {
                showInvalidate ?
                    <Button
                        className="absolute top-4 right-4"
                        onClick={() => invalidateSession(session.id)}>
                        Invalidate
                    </Button>
                    :
                    <Badge
                        className="absolute top-4 right-4">
                        This session
                    </Badge>
            }
        </Card>
    );
}