'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { kratos } from '@/ory';
import { Session } from '@ory/client';
import SessionItem from '@/components/sessionItem';
import { Separator } from '@/components/ui/separator';

export default function AccountSessions() {

    const [current, setCurrent] = useState<Session>();
    const [sessions, setSessions] = useState<Session[]>();

    const invalidateSession = useCallback(async (id: string) => {

        console.log('Disabling session with id', id);

        kratos.disableMySession({ id: id })
            .then(() => console.log('Disabled session with id', id))
            .catch(() => console.error('Error while disabling session with id', id))
            .finally(() => {
                loadSessions().then((response) => {
                    setCurrent(response.current);
                    setSessions(response.sessions);
                });
            });
    }, []);

    const loadSessions = useCallback(async () => {

        console.log('Refreshing sessions');

        const current = await kratos.toSession();
        const sessions = await kratos.listMySessions();

        console.log(current.data);
        console.log(sessions.data);

        return {
            current: current.data,
            sessions: sessions.data,
        };
    }, []);

    useEffect(() => {
        loadSessions().then(response => {
            setCurrent(response.current);
            setSessions(response.sessions);
        });
    }, []);

    return (
        <div className="flex flex-col items-center space-y-4 w-full max-w-md">
            {
                current ?
                    <SessionItem session={current!!} showInvalidate={false} invalidateSession={invalidateSession}/>
                    :
                    <></>
            }
            {
                sessions && sessions.length > 0 ?
                    <Separator/>
                    :
                    <></>
            }
            {
                sessions?.map(item => {
                    return (
                        <SessionItem
                            key={item.id}
                            session={item}
                            showInvalidate={true}
                            invalidateSession={invalidateSession}/>
                    );
                })
            }
        </div>
    );
}
