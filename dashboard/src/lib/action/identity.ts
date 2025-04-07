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
import { identities, identity_recovery_addresses, identity_verifiable_addresses } from '@/db/schema';
import { eq, ilike, or, sql } from 'drizzle-orm';
import { checkPermission, requireSession } from '@/lib/action/authentication';
import { permission, relation } from '@/lib/permission';

export async function getIdentity(id: string) {

    const session = await requireSession();
    const allowed = await checkPermission(permission.user.it, relation.access, session.identity!.id);
    if (!allowed) {
        throw Error('Unauthorised');
    }

    const identityApi = await getIdentityApi();
    const { data } = await identityApi.getIdentity({ id });

    console.log('Got identity', data);

    return data;
}


export async function getIdentitySchema(id: string) {

    const identityApi = await getIdentityApi();
    const { data } = await identityApi.getIdentitySchema({ id: id });

    console.log('Got identity schema');

    return data;
}

export async function queryIdentities(page: number, pageSize: number, query?: string) {

    const session = await requireSession();
    const allowed = await checkPermission(permission.user.it, relation.access, session.identity!.id);
    if (!allowed) {
        throw Error('Unauthorised');
    }

    if (page < 1 || pageSize < 1) {
        return {
            data: [],
            pageCount: 0,
        };
    }

    const db = await getDB();
    const result = await db.select()
        .from(identities)
        .leftJoin(identity_verifiable_addresses, eq(identities.id, identity_verifiable_addresses.identity_id))
        .leftJoin(identity_recovery_addresses, eq(identities.id, identity_recovery_addresses.identity_id))
        .where(or(
            sql`${identities.id}::text ILIKE
            ${`%${query}%`}`,
            sql`${identities.traits}::text ILIKE
            ${`%${query}%`}`,
            ilike(identity_verifiable_addresses.value, `%${query}%`),
        ))
        .orderBy(identities.id)
        .limit(pageSize)
        .offset((page - 1) * pageSize);

    const resultCount = await db.$count(
        db.select()
            .from(identities)
            .leftJoin(identity_verifiable_addresses, eq(identities.id, identity_verifiable_addresses.identity_id))
            .leftJoin(identity_recovery_addresses, eq(identities.id, identity_recovery_addresses.identity_id))
            .where(or(
                sql`${identities.id}::text ILIKE
                ${`%${query}%`}`,
                sql`${identities.traits}::text ILIKE
                ${`%${query}%`}`,
                ilike(identity_verifiable_addresses.value, `%${query}%`),
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

export async function updateIdentity(id: string, body: UpdateIdentityBody) {

    const session = await requireSession();
    const allowed = await checkPermission(permission.user.it, relation.edit, session.identity!.id);
    if (!allowed) {
        throw Error('Unauthorised');
    }

    const identityApi = await getIdentityApi();
    const { data } = await identityApi.updateIdentity({
        id: id,
        updateIdentityBody: body,
    });

    console.log('Updated identity', data);

    revalidatePath('/user');

    return data;
}

export async function deleteIdentityCredential(id: string, type: DeleteIdentityCredentialsTypeEnum) {

    const session = await requireSession();
    const allowed = await checkPermission(permission.user.credential, relation.delete, session.identity!.id);
    if (!allowed) {
        throw Error('Unauthorised');
    }

    const identityApi = await getIdentityApi();
    const { data } = await identityApi.deleteIdentityCredentials({ id, type });

    console.log('Credential removed', data);

    revalidatePath('/user');

    return data;
}

export async function listIdentitySessions(id: string) {

    const session = await requireSession();
    const allowed = await checkPermission(permission.user.session, relation.access, session.identity!.id);
    if (!allowed) {
        throw Error('Unauthorised');
    }

    const identityApi = await getIdentityApi();
    const { data } = await identityApi.listIdentitySessions({ id });

    console.log('Listed identity\'s sessions', data);

    return data;
}

export async function deleteIdentitySessions(id: string) {

    const session = await requireSession();
    const allowed = await checkPermission(permission.user.session, relation.delete, session.identity!.id);
    if (!allowed) {
        throw Error('Unauthorised');
    }

    const identityApi = await getIdentityApi();
    const { data } = await identityApi.deleteIdentitySessions({ id });

    console.log('Deleted identity\'s sessions', data);

    revalidatePath('/user');

    return data;
}

export async function createRecoveryCode(id: string) {

    const session = await requireSession();
    const allowed = await checkPermission(permission.user.code, relation.create, session.identity!.id);
    if (!allowed) {
        throw Error('Unauthorised');
    }

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

    const session = await requireSession();
    const allowed = await checkPermission(permission.user.link, relation.create, session.identity!.id);
    if (!allowed) {
        throw Error('Unauthorised');
    }

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

    const session = await requireSession();
    const allowed = await checkPermission(permission.user.state, relation.edit, session.identity!.id);
    if (!allowed) {
        throw Error('Unauthorised');
    }

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

    const session = await requireSession();
    const allowed = await checkPermission(permission.user.state, relation.edit, session.identity!.id);
    if (!allowed) {
        throw Error('Unauthorised');
    }

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

    const session = await requireSession();
    const allowed = await checkPermission(permission.user.it, relation.delete, session.identity!.id);
    if (!allowed) {
        throw Error('Unauthorised');
    }

    const identityApi = await getIdentityApi();
    const { data } = await identityApi.deleteIdentity({ id });

    console.log('Deleted identity', data);

    revalidatePath('/user');
}
