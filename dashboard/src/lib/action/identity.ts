'use server';

import { getIdentityApi } from '@/ory/sdk/server';
import { revalidatePath } from 'next/cache';
import {
    DeleteIdentityCredentialsTypeEnum,
    Identity,
    RecoveryIdentityAddress,
    UpdateIdentityBody,
    VerifiableIdentityAddress,
} from '@ory/client';
import { getDB } from '@/db';
import { identities, identityRecoveryAddresses, identityVerifiableAddresses } from '@/db/schema';
import { eq, ilike, or, sql } from 'drizzle-orm';

interface QueryIdentitiesProps {
    page: number,
    pageSize: number,
    query?: string,
}

export async function queryIdentities({ page, pageSize, query }: QueryIdentitiesProps) {

    if (page < 1 || pageSize < 1) {
        return {
            data: [],
            pageCount: 0,
        };
    }

    const db = await getDB();
    const result = await db.select()
        .from(identities)
        .leftJoin(identityVerifiableAddresses, eq(identities.id, identityVerifiableAddresses.identityId))
        .leftJoin(identityRecoveryAddresses, eq(identities.id, identityRecoveryAddresses.identityId))
        .where(or(
            sql`${identities.id}::text ILIKE
            ${`%${query}%`}`,
            sql`${identities.traits}::text ILIKE
            ${`%${query}%`}`,
            ilike(identityVerifiableAddresses.value, `%${query}%`),
        ))
        .orderBy(identities.id)
        .limit(pageSize)
        .offset((page - 1) * pageSize);

    const resultCount = await db.$count(
        db.select()
            .from(identities)
            .leftJoin(identityVerifiableAddresses, eq(identities.id, identityVerifiableAddresses.identityId))
            .leftJoin(identityRecoveryAddresses, eq(identities.id, identityRecoveryAddresses.identityId))
            .where(or(
                sql`${identities.id}::text ILIKE
                ${`%${query}%`}`,
                sql`${identities.traits}::text ILIKE
                ${`%${query}%`}`,
                ilike(identityVerifiableAddresses.value, `%${query}%`),
            ))
            .as('subquery'),
    );

    const resultTyped = result.map((it) => {
        const typed = it.identities as unknown as Identity;
        typed.verifiable_addresses = [it.identity_verifiable_addresses] as unknown as VerifiableIdentityAddress[];
        typed.recovery_addresses = [it.identity_verifiable_addresses] as unknown as RecoveryIdentityAddress[];
        return typed;
    });

    return {
        data: resultTyped,
        itemCount: resultCount,
        pageCount: Math.ceil(resultCount / pageSize),
    };
}


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
