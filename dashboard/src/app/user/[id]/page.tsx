import React from 'react';
import { getIdentityApi } from '@/ory/sdk/server';
import { ErrorDisplay } from '@/components/error';

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {

    const identityId = (await params).id;

    console.log('Loading identity', identityId);

    const identityApi = await getIdentityApi();
    const identity = await identityApi.getIdentity({ id: identityId })
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

    const address = identity.verifiable_addresses[0];

    return (
        <div className="space-y-4">
            <div>
                <p className="text-3xl font-bold leading-tight tracking-tight">{address.value}</p>
                <p className="text-lg font-light">{identity.id}</p>
            </div>
        </div>
    );
}
