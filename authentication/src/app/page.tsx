'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { SettingsFlow, UpdateSettingsFlowBody } from '@ory/client';
import { kratos } from '@/ory/sdk/kratos';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flow, HandleError, LogoutLink } from '@/ory';
import { ThemeToggle } from '@/components/themeToggle';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function Home() {

    const [flow, setFlow] = useState<SettingsFlow>();

    const router = useRouter();
    const params = useSearchParams();

    const returnTo = params.get('return_to') ?? undefined;
    const flowId = params.get('flow') ?? undefined;

    const onLogout = LogoutLink();

    const getFlow = useCallback((flowId: string) => {
        return kratos
            .getSettingsFlow({ id: String(flowId) })
            .then(({ data }) => setFlow(data))
            .catch(handleError);
    }, []);

    const handleError = useCallback((error: AxiosError) => {
        const handle = HandleError(getFlow, setFlow, '/flow/settings', true, router);
        return handle(error);
    }, [getFlow]);

    const createFlow = useCallback((returnTo: string | undefined) => {
        kratos
            .createBrowserSettingsFlow({ returnTo })
            .then(({ data }) => {
                setFlow(data);
                router.push(`?flow=${data.id}`);
            })
            .catch(handleError);
    }, [handleError]);

    const updateFlow = async (body: UpdateSettingsFlowBody) => {
        kratos
            .updateSettingsFlow({
                flow: String(flow?.id),
                updateSettingsFlowBody: body,
            })
            .then(({ data }) => {

                // update flow object
                setFlow(data);

                // show toast for user feedback
                const message = data.ui.messages?.pop();
                if (message) {
                    toast.success(message.text);
                }

                // check if verification is needed
                if (data.continue_with) {
                    for (const item of data.continue_with) {
                        switch (item.action) {
                            case 'show_verification_ui':
                                router.push('/verification?flow=' + item.flow.id);
                                return;
                        }
                    }
                }

                // check if custom return page was specified
                if (data.return_to) {
                    window.location.href = data.return_to;
                    return;
                }
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

        createFlow(returnTo);

    }, [flowId, router, returnTo, createFlow, getFlow]);

    return (
        <div className="flex flex-col min-h-screen items-center text-3xl relative space-y-4">
            <div className="absolute flex flex-row w-fit items-center space-x-4 top-4 right-4">
                <ThemeToggle/>
                <Button variant="outline" size="icon" onClick={onLogout}>
                    <LogOut className="h-[1.2rem] w-[1.2rem]"/>
                </Button>
            </div>
            <div className="flex flex-col items-center space-y-4 w-full max-w-md">
                <p className="mt-4 py-4 text-4xl">Settings</p>
                {
                    flow?.ui.nodes.some(({ group }) => group === 'profile') && (
                        <Card className="w-full max-w-md animate-fadeIn">
                            <CardHeader>
                                <CardTitle>
                                    Password
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Flow
                                    onSubmit={updateFlow}
                                    flow={flow}
                                    only="profile"
                                    hideGlobalMessages/>
                            </CardContent>
                        </Card>
                    )
                }
                {
                    flow?.ui.nodes.some(({ group }) => group === 'password') && (
                        <Card className="w-full max-w-md animate-fadeIn">
                            <CardHeader>
                                <CardTitle>
                                    Password
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Flow
                                    onSubmit={updateFlow}
                                    flow={flow}
                                    only="password"
                                    hideGlobalMessages/>
                            </CardContent>
                        </Card>
                    )
                }
                {
                    flow?.ui.nodes.some(({ group }) => group === 'totp') && (
                        <Card className="w-full max-w-md animate-fadeIn">
                            <CardHeader>
                                <CardTitle>
                                    MFA
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Flow
                                    onSubmit={updateFlow}
                                    flow={flow}
                                    only="totp"
                                    hideGlobalMessages/>
                            </CardContent>
                        </Card>
                    )
                }
                {
                    flow?.ui.nodes.some(({ group }) => group === 'oidc') && (
                        <Card className="w-full max-w-md animate-fadeIn">
                            <CardHeader>
                                <CardTitle>
                                    Connect Socials
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Flow
                                    onSubmit={updateFlow}
                                    flow={flow}
                                    only="oidc"
                                    hideGlobalMessages/>
                            </CardContent>
                        </Card>
                    )
                }
                {
                    flow?.ui.nodes.some(({ group }) => group === 'link') && (
                        <Card className="w-full max-w-md animate-fadeIn">
                            <CardHeader>
                                <CardTitle>
                                    Connect Socials
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Flow
                                    onSubmit={updateFlow}
                                    flow={flow}
                                    only="link"
                                    hideGlobalMessages/>
                            </CardContent>
                        </Card>
                    )
                }
                {
                    flow?.ui.nodes.some(({ group }) => group === 'webauthn') && (
                        <Card className="w-full max-w-md animate-fadeIn">
                            <CardHeader>
                                <CardTitle>
                                    Connect Socials
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Flow
                                    onSubmit={updateFlow}
                                    flow={flow}
                                    only="webauthn"
                                    hideGlobalMessages/>
                            </CardContent>
                        </Card>
                    )
                }
                {
                    flow?.ui.nodes.some(({ group }) => group === 'lookup_secret') && (
                        <Card className="w-full max-w-md animate-fadeIn">
                            <CardHeader>
                                <CardTitle>
                                    Recovery Codes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Flow
                                    onSubmit={updateFlow}
                                    flow={flow}
                                    only="lookup_secret"
                                    hideGlobalMessages/>
                            </CardContent>
                        </Card>
                    )
                }
            </div>
        </div>
    );
}
