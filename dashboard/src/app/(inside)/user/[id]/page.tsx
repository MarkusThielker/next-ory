import React from 'react';
import { getIdentityApi } from '@/ory/sdk/server';
import { ErrorDisplay } from '@/components/error';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IdentityTraits } from '@/components/identity/identity-traits';
import { KratosSchema } from '@/lib/forms/identity-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UAParser } from 'ua-parser-js';
import { RecoveryIdentityAddress, VerifiableIdentityAddress } from '@ory/client';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { IdentityActions } from '@/components/identity/identity-actions';
import { IdentityCredentials } from '@/components/identity/identity-credentials';

interface MergedAddress {
    recovery_id?: string;
    verifiable_id?: string;
    verified?: boolean;
    verified_at?: string;
    value: string;
    via: string;
}

function mergeAddresses(
    recovery: RecoveryIdentityAddress[],
    verifiable: VerifiableIdentityAddress[],
): MergedAddress[] {

    const merged = [...recovery, ...verifiable];
    return merged.reduce((acc: MergedAddress[], curr: any) => {

        const existingValue =
            acc.find(item => item.value && curr.value && item.value === curr.value);

        if (!existingValue) {

            let newEntry: MergedAddress;
            if (curr.status) {

                // status property exists only in verifiable addresses
                // expecting verifiable address
                newEntry = {
                    verifiable_id: curr.id,
                    verified: curr.verified,
                    verified_at: curr.verified_at,
                    value: curr.value,
                    via: curr.via,
                } as MergedAddress;

            } else {

                // expecting recovery address
                newEntry = {
                    recovery_id: curr.id,
                    value: curr.value,
                    via: curr.via,
                } as MergedAddress;
            }

            acc.push(newEntry);

        } else {

            const additionalValues = {
                recovery_id: existingValue.recovery_id,
                verifiable_id: curr.id,
                verified: curr.verified,
                verified_at: curr.verified_at,
            };

            Object.assign(existingValue, additionalValues);
        }
        return acc;
    }, []);
}

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {

    const identityId = (await params).id;

    const identityApi = await getIdentityApi();
    const identity = await identityApi.getIdentity({ id: identityId })
        .then((response) => {
            console.log('identity', response.data);
            return response.data;
        })
        .catch(() => {
            console.log('Identity not found');
        });

    const sessions = await identityApi.listIdentitySessions({ id: identityId })
        .then((response) => response.data)
        .catch(() => {
            console.log('No sessions found');
        });

    if (!identity) {
        return <ErrorDisplay
            title="Identity not found"
            message={`The requested identity with id ${identityId} does not exist`}/>;
    }

    if (!identity.verifiable_addresses || !identity.verifiable_addresses[0]) {
        return <ErrorDisplay
            title="No verifiable adress"
            message="The identity you are trying to see exists but has no identifiable address"/>;
    }

    const identitySchema = await identityApi
        .getIdentitySchema({ id: identity.schema_id })
        .then((response) => response.data as KratosSchema);

    const addresses = mergeAddresses(
        identity.recovery_addresses ?? [],
        identity.verifiable_addresses ?? [],
    );

    return (
        <div className="space-y-4">
            <div>
                <p className="text-3xl font-bold leading-tight tracking-tight">{addresses[0].value}</p>
                <p className="text-lg font-light">{identity.id}</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <Card className="row-span-3">
                    <CardHeader>
                        <CardTitle>Traits</CardTitle>
                        <CardDescription>All identity properties specified in the identity schema</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <IdentityTraits schema={identitySchema} identity={identity}/>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                        <CardDescription>Quick actions to manage the identity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <IdentityActions identity={identity}/>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Addresses</CardTitle>
                        <CardDescription>All linked addresses for verification and recovery</CardDescription>
                    </CardHeader>
                    <CardContent>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    addresses.map((address) => {
                                        return (
                                            <TableRow key={address.value}>
                                                <TableCell>{address.value}</TableCell>
                                                <TableCell>{address.via}</TableCell>
                                                <TableCell>
                                                    {address.verifiable_id &&
                                                        <Badge className="m-1 space-x-1">
                                                            <span>Verifiable</span>
                                                            {
                                                                address.verified ?
                                                                    <Check className="h-3 w-3"/>
                                                                    :
                                                                    <X className="h-3 w-3"/>
                                                            }
                                                        </Badge>
                                                    }
                                                    {address.recovery_id &&
                                                        <Badge className="m-1">Recovery</Badge>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                }
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Credentials</CardTitle>
                        <CardDescription>All authentication mechanisms registered with this identity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <IdentityCredentials identity={identity}/>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Sessions</CardTitle>
                        <CardDescription>See and manage all sessions of this identity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>OS</TableHead>
                                    <TableHead>Browser</TableHead>
                                    <TableHead>Active since</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    sessions ?
                                        sessions.map((session) => {

                                            const device = session.devices![0];
                                            const parser = new UAParser(device.user_agent);
                                            const result = parser.getResult();

                                            return (
                                                <TableRow key={session.id}>
                                                    <TableCell className="space-x-1">
                                                        <span>{result.os.name}</span>
                                                        <span
                                                            className="text-xs text-neutral-500">{result.os.version}</span>
                                                    </TableCell>
                                                    <TableCell className="space-x-1">
                                                        <span>{result.browser.name}</span>
                                                        <span
                                                            className="text-xs text-neutral-500">{result.browser.version}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(session.authenticated_at!).toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                        :
                                        <ErrorDisplay title="No sessions" message=""/>
                                }
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
