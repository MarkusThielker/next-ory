'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flow, HandleError, kratos, LogoutLink } from '@/ory';
import Link from 'next/link';
import { LoginFlow, UpdateLoginFlowBody } from '@ory/client';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { AxiosError } from 'axios';

export default function Login() {

    const [flow, setFlow] = useState<LoginFlow>();

    const router = useRouter();
    const params = useSearchParams();

    const flowId = params.get('flow') ?? undefined;
    const aal = params.get('aal') ?? undefined;
    const refresh = Boolean(params.get('refresh')) ? true : undefined;
    const returnTo = params.get('return_to') ?? undefined;
    const loginChallenge = params.get('login_challenge') ?? undefined;

    const onLogout = LogoutLink([aal, refresh]);

    const getFlow = useCallback((flowId: string) => {
        return kratos
            .getLoginFlow({ id: String(flowId) })
            .then(({ data }) => setFlow(data))
            .catch(handleError);
    }, []);

    const handleError = useCallback((error: AxiosError) => {
        const handle = HandleError(getFlow, setFlow, '/flow/login', true, router);
        return handle(error);
    }, [getFlow]);

    const createFlow = useCallback((aal: string | undefined, refresh: boolean | undefined, returnTo: string | undefined, loginChallenge: string | undefined) => {
        kratos
            .createBrowserLoginFlow({ aal, refresh, returnTo, loginChallenge })
            .then(({ data }) => {
                setFlow(data);
                router.push(`?flow=${data.id}`);
            })
            .catch(handleError);
    }, [handleError]);

    const updateFlow = async (body: UpdateLoginFlowBody) => {
        kratos
            .updateLoginFlow({
                flow: String(flow?.id),
                updateLoginFlowBody: body,
            })
            .then(() => {
                if (flow?.return_to) {
                    window.location.href = flow?.return_to;
                    return;
                }
                router.push('/');
            })
            .catch(handleError);
    };

    useEffect(() => {

        if (flow) {
            return;
        }

        if (flowId) {
            getFlow(flowId).then();
            return;
        }

        createFlow(aal, refresh, returnTo, loginChallenge);

    }, [flowId, router, aal, refresh, returnTo, createFlow, loginChallenge, getFlow]);

    return (
        <Card className="flex flex-col items-center w-full max-w-sm p-4">
            <Image className="mt-10 mb-4"
                   width="64"
                   height="64"
                   src="/mt-logo-orange.png"
                   alt="Markus Thielker Intranet"/>
            <CardHeader className="flex flex-col items-center text-center space-y-4">
                {
                    flow ?
                        <div className="flex flex-col space-y-4">
                            <CardTitle>{
                                (() => {
                                    if (flow?.refresh) {
                                        return 'Confirm Action';
                                    } else if (flow?.requested_aal === 'aal2') {
                                        return 'Two-Factor Authentication';
                                    }
                                    return 'Welcome';
                                })()}
                            </CardTitle>
                            <CardDescription className="max-w-xs">
                                Log in to the Intranet to access all locally hosted applications.
                            </CardDescription>
                        </div>
                        :
                        <div className="flex flex-col space-y-6">
                            <Skeleton className="h-6 w-full rounded-md"/>
                            <div className="flex flex-col space-y-2">
                                <Skeleton className="h-3 w-full rounded-md"/>
                                <Skeleton className="h-3 w-[250px] rounded-md"/>
                            </div>
                        </div>
                }
            </CardHeader>
            <CardContent className="w-full">
                {
                    flow
                        ? <Flow flow={flow} onSubmit={updateFlow}/>
                        : (
                            <div className="flex flex-col space-y-4 mt-4">
                                <div className="flex flex-col space-y-2">
                                    <Skeleton className="h-3 w-[80px] rounded-md"/>
                                    <Skeleton className="h-8 w-full rounded-md"/>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Skeleton className="h-3 w-[80px] rounded-md"/>
                                    <Skeleton className="h-8 w-full rounded-md"/>
                                </div>
                                <Button disabled>
                                    <Skeleton className="h-4 w-[80px] rounded-md"/>
                                </Button>
                            </div>
                        )
                }
            </CardContent>
            {
                flow?.requested_aal === 'aal2' || flow?.requested_aal === 'aal3' || flow?.refresh ? (
                    <Button onClick={onLogout} variant="link">
                        Log out
                    </Button>
                ) : (
                    <div className="flex flex-col">
                        {
                            flow ?
                                <Button variant="link" asChild>
                                    <Link href="/flow/recovery" className="text-orange-600" passHref>
                                        <span>Forgot your password?</span>
                                    </Link>
                                </Button>
                                :
                                <Skeleton className="h-3 w-[180px] rounded-md my-3.5"/>
                        }
                        {
                            flow ?
                                <Button variant="link" asChild disabled={!flow}>
                                    <Link href="/flow/registration" className="inline-flex space-x-2" passHref>
                                        <span>Create an account</span>
                                    </Link>
                                </Button>
                                :
                                <Skeleton className="h-3 w-[180px] rounded-md my-3.5"/>
                        }
                    </div>
                )
            }
        </Card>
    );
}
