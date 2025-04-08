'use server';

import { clientFormSchema } from '@/lib/forms/client-form';
import { z } from 'zod';
import { getOAuth2Api } from '@/ory/sdk/server';
import { checkPermission, requireSession } from '@/lib/action/authentication';
import { permission, relation } from '@/lib/permission';

export async function createClient(
    formData: z.infer<typeof clientFormSchema>,
) {

    const session = await requireSession();
    const allowed = await checkPermission(permission.client.it, relation.create, session.identity!.id);
    if (!allowed) {
        throw Error('Unauthorised');
    }

    console.log(session.identity?.traits.email, 'posted form', formData);

    const oauthApi = await getOAuth2Api();
    return await oauthApi.createOAuth2Client({ oAuth2Client: formData });
}
