import React from 'react';
import { getIdentityApi } from '@/ory/sdk/server';
import { ErrorDisplay } from '@/components/error';

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {

    const identityId = (await params).id;

    console.log('Loading identity', identityId);

    const identityApi = await getIdentityApi();
    const sessions = await identityApi.listIdentitySessions({ id: identityId })
        .then((response) => response.data)
        .catch(() => {
            console.log('Identity not found');
        });

    if (!sessions) {
        return <ErrorDisplay
            title="Identity not found"
            message={`The requested identity with id ${identityId} does not exist`}/>;
    }

    return (
        <div className="space-y-4">
            <div>
                <p className="text-3xl font-bold leading-tight tracking-tight">Sessions</p>
                <p className="text-lg font-light">These are all active sessions of the identity</p>
            </div>
        </div>
    );
}
