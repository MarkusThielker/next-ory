'use server';

import { getIdentityApi } from '@/ory/sdk/server';
import { revalidatePath } from 'next/cache';
import { DeleteIdentityCredentialsTypeEnum, UpdateIdentityBody } from '@ory/client';

interface UpdatedIdentityProps {
    id: string;
    body: UpdateIdentityBody;
}

export async function updateIdentity({ id, body }: UpdatedIdentityProps) {

    const identityApi = await getIdentityApi();
    const { data } = await identityApi.updateIdentity({
        id: id,
        updateIdentityBody: body,
    });

    console.log('Updated identity', data);

    revalidatePath('/user');

    return data;
}

interface DeleteIdentityCredentialProps {
    id: string;
    type: DeleteIdentityCredentialsTypeEnum;
}

export async function deleteIdentityCredential({ id, type }: DeleteIdentityCredentialProps) {

    const identityApi = await getIdentityApi();
    const { data } = await identityApi.deleteIdentityCredentials({ id, type });

    console.log('Credential removed', data);

    revalidatePath('/user');

    return data;
}

export async function deleteIdentitySessions(id: string) {

    const identityApi = await getIdentityApi();
    const { data } = await identityApi.deleteIdentitySessions({ id });

    console.log('Deleted identity\'s sessions', data);

    revalidatePath('/user');

    return data;
}

export async function createRecoveryCode(id: string) {

    const identityApi = await getIdentityApi();
    const { data } = await identityApi.createRecoveryCodeForIdentity({
        createRecoveryCodeForIdentityBody: {
            identity_id: id,
        },
    });

    console.log('Created recovery code for user', id, data);

    return data;
}

export async function createRecoveryLink(id: string) {

    const identityApi = await getIdentityApi();
    const { data } = await identityApi.createRecoveryLinkForIdentity({
        createRecoveryLinkForIdentityBody: {
            identity_id: id,
        },
    });

    console.log('Created recovery link for user', id, data);

    return data;
}

export async function blockIdentity(id: string) {

    const identityApi = await getIdentityApi();
    const { data } = await identityApi.patchIdentity({
        id,
        jsonPatch: [
            {
                op: 'replace',
                path: '/state',
                value: 'inactive',
            },
        ],
    });

    console.log('Blocked identity', data);

    revalidatePath('/user');
}

export async function unblockIdentity(id: string) {

    const identityApi = await getIdentityApi();
    const { data } = await identityApi.patchIdentity({
        id,
        jsonPatch: [
            {
                op: 'replace',
                path: '/state',
                value: 'active',
            },
        ],
    });

    console.log('Unblocked identity', data);

    revalidatePath('/user');
}

export async function deleteIdentity(id: string) {

    const identityApi = await getIdentityApi();
    const { data } = await identityApi.deleteIdentity({ id });

    console.log('Deleted identity', data);

    revalidatePath('/user');
}