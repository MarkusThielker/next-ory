'use server';

import { getFrontendApi, getPermissionApi } from '@/ory/sdk/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getSession() {

    const cookie = await cookies();

    const frontendApi = await getFrontendApi();

    return frontendApi
        .toSession({ cookie: 'ory_kratos_session=' + cookie.get('ory_kratos_session')?.value })
        .then((response) => response.data)
        .catch(() => null);
}

export async function requireSession() {

    const session = await getSession();

    if (!session) {

        // TODO: set return_to dynamically
        const url = process.env.NEXT_PUBLIC_AUTHENTICATION_NODE_URL +
            '/flow/login?return_to=' + process.env.NEXT_PUBLIC_DASHBOARD_NODE_URL;

        console.log('Intercepted request with missing session');
        console.log('Redirecting client to: ', url);

        redirect(url);
    }

    return session;
}


export async function checkRole(
    object: string,
    subjectId: string,
) {

    const permissionApi = await getPermissionApi();
    return permissionApi.checkPermission({
        namespace: 'roles',
        object,
        relation: 'member',
        subjectId,
    })
        .then(({ data: { allowed } }) => allowed)
        .catch(_ => false);
}

export async function requireRole(
    object: string,
    subjectId: string,
) {

    const hasRole = await checkRole(object, subjectId);

    if (!hasRole) {
        console.log(`Intercepted request with missing role ${object} for identity ${subjectId}`);
        redirect('/unauthorised');
    }

    return hasRole;
}


export async function checkPermission(
    object: string,
    relation: string,
    subjectId: string,
) {

    const permissionApi = await getPermissionApi();
    return permissionApi.checkPermission({
        namespace: 'permissions',
        object,
        relation,
        subjectId,
    })
        .then(({ data: { allowed } }) => allowed)
        .catch(_ => false);
}

export async function requirePermission(
    object: string,
    relation: string,
    subjectId: string,
) {

    const allowed = await checkPermission(
        object,
        relation,
        subjectId,
    );

    if (!allowed) {
        console.log(`Intercepted request with insufficient permission (${object}#${relation}@${subjectId})`);
        redirect('/unauthorised');
    }

    return allowed;
}
