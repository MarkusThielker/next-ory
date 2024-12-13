import React from 'react';
import { getIdentityApi } from '@/ory/sdk/server';
import { ErrorDisplay } from '@/components/error';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IdentityTraitForm } from '@/components/forms/IdentityTraitForm';
import { KratosSchema } from '@/lib/forms/identity-form';

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {

    const identityId = (await params).id;

    const identityApi = await getIdentityApi();
    const identity = await identityApi.getIdentity({
        id: identityId,
        includeCredential: [
            'code',
            'code_recovery',
            'link_recovery',
            'lookup_secret',
            'oidc',
            'passkey',
            'password',
            'totp',
            'webauthn',
        ],
    })
        .then((response) => response.data)
        .catch(() => {
            console.log('Identity not found');
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

    const address = identity.verifiable_addresses[0];

    return (
        <div className="space-y-4">
            <div>
                <p className="text-3xl font-bold leading-tight tracking-tight">{address.value}</p>
                <p className="text-lg font-light">{identity.id}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Traits</CardTitle>
                        <CardDescription>All identity properties specified in the identity schema</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <IdentityTraitForm schema={identitySchema} identity={identity}/>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Addresses</CardTitle>
                        <CardDescription></CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Credentials</CardTitle>
                        <CardDescription>All authentication mechanisms registered with this identity</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Sessions</CardTitle>
                        <CardDescription>See and manage all sessions of this identity</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
