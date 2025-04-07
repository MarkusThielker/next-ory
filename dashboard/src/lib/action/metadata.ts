'use server';

import { getHydraMetadataApi, getKetoMetadataApi, getKratosMetadataApi } from '@/ory/sdk/server';
import { MetadataApiReady } from '@/components/status-card';
import { checkPermission, requireSession } from '@/lib/action/authentication';
import { permission, relation } from '@/lib/permission';

export async function kratosMetadata() {

    const session = await requireSession();
    const allowed = await checkPermission(permission.stack.status, relation.access, session.identity!.id);
    if (!allowed) {
        return;
    }

    const api = await getKratosMetadataApi();

    const version = await api.getVersion()
        .then(res => res.data.version)
        .catch(() => undefined);

    const status = await fetch(process.env.ORY_KRATOS_ADMIN_URL + '/health/ready')
        .then((response) => response.json() as MetadataApiReady)
        .catch(() => {
            return { errors: ['No instance running'] } as MetadataApiReady;
        });

    return {
        version,
        status,
    };
}

export async function hydraMetadata() {

    const session = await requireSession();
    const allowed = await checkPermission(permission.stack.status, relation.access, session.identity!.id);
    if (!allowed) {
        return;
    }

    const api = await getHydraMetadataApi();

    const version = await api.getVersion()
        .then(res => res.data.version)
        .catch(() => undefined);

    const status = await fetch(process.env.ORY_HYDRA_ADMIN_URL + '/health/ready')
        .then((response) => response.json() as MetadataApiReady)
        .catch(() => {
            return { errors: ['No instance running'] } as MetadataApiReady;
        });

    return {
        version,
        status,
    };
}

export async function ketoMetadata() {

    const session = await requireSession();
    const allowed = await checkPermission(permission.stack.status, relation.access, session.identity!.id);
    if (!allowed) {
        return;
    }

    const api = await getKetoMetadataApi();

    const version = await api.getVersion()
        .then(res => res.data.version)
        .catch(() => undefined);

    const status = await fetch(process.env.ORY_KETO_ADMIN_URL + '/health/ready')
        .then((response) => response.json() as MetadataApiReady)
        .catch(() => {
            return { errors: ['No instance running'] } as MetadataApiReady;
        });

    return {
        version,
        status,
    };
}
