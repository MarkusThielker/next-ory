'use client';

import { OAuth2ConsentRequest, Session } from '@ory/client';
import React, { useEffect, useState } from 'react';
import { kratos } from '@/ory';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface ConsentFormProps {
    request: OAuth2ConsentRequest;
    onAccept: (challenge: string, scopes: string[], remember: boolean) => void;
    onReject: (challenge: string) => void;
}

export default function ConsentForm(
    {
        request,
        onAccept,
        onReject,
    }: ConsentFormProps,
) {

    const router = useRouter();

    const [session, setSession] = useState<Session | undefined>();

    const [remember, setRemember] = useState<boolean>(false);
    const [requestedScopes, setRequestedScopes] = useState<string[]>(request.requested_scope ?? []);

    useEffect(() => {
        kratos
            .toSession()
            .then(({ data }) => setSession(data))
            .catch(() => router.push('/flow/login'));
    }, []);

    return (
        <>
            <Image className="mt-10 mb-4"
                   width="64"
                   height="64"
                   src="/mt-logo-orange.png"
                   alt="Markus Thielker Intranet"/>
            <CardHeader className="flex items-center text-center space-y-4">
                <CardTitle>Welcome {session?.identity?.traits.name}</CardTitle>
                <CardDescription className="max-w-xs">
                    The application {request?.client?.client_name} requests access to the following permissions:
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                    {request?.requested_scope?.map(scope => (
                        <div key={scope} className="flex flex-row space-x-2">
                            <Checkbox
                                checked={requestedScopes?.includes(scope)}
                                onCheckedChange={() => {
                                    if (requestedScopes?.includes(scope)) {
                                        setRequestedScopes(requestedScopes.filter(it => it !== scope));
                                    } else {
                                        setRequestedScopes([...requestedScopes, scope]);
                                    }
                                }}
                            />
                            <Label>{scope}</Label>
                        </div>
                    ))}
                </div>
                <CardDescription>
                    Only grant permissions if you trust this site or app. You don&apos;t need to accept all permissions.
                </CardDescription>
                <div className="flex flex-row">
                    {request?.client?.policy_uri && (
                        <a href={request?.client.policy_uri} className="text-xs" target="_blank"
                           rel="noreferrer">
                            Privacy Policy
                        </a>
                    )}
                    {request?.client?.tos_uri && (
                        <a href={request?.client.tos_uri} className="text-xs" target="_blank" rel="noreferrer">
                            Terms of Service
                        </a>
                    )}
                </div>
                <Separator className="my-4"/>
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-row space-x-4">
                        <Checkbox
                            checked={remember}
                            onCheckedChange={() => setRemember(!remember)}/>
                        <div className="flex flex-col space-y-2">
                            <Label>Remember my decision</Label>
                            <Label className="text-xs font-normal">
                                Remember this decision for next time. The application will not be able to ask
                                for
                                additional permissions without your consent.
                            </Label>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex w-full space-x-2 justify-end">
                <Button
                    variant="outline"
                    onClick={() => onReject(request.challenge)}>
                    Reject
                </Button>
                <Button
                    variant="default"
                    onClick={() => onAccept(request.challenge, requestedScopes, remember)}>
                    Accept
                </Button>
            </CardFooter>
        </>
    );
}
