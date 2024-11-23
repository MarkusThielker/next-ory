'use client';

import React from 'react';
import { SettingsFlow, UpdateSettingsFlowBody } from '@ory/client';
import { Flow } from '@/ory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AccountSettingsProps {
    flow: SettingsFlow | undefined;
    updateFlow: (body: UpdateSettingsFlowBody) => Promise<void>;
}

export default function AccountSettings({ flow, updateFlow }: AccountSettingsProps) {

    return (
        <div className="flex flex-col items-center space-y-4 w-full max-w-md">
            {
                flow?.ui.nodes.some(({ group }) => group === 'profile') && (
                    <Card className="w-full max-w-md animate-fadeIn">
                        <CardHeader>
                            <CardTitle>
                                Profile
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
    );
}