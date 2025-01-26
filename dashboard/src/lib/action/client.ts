'use server';

import { clientFormSchema } from '@/lib/forms/client-form';
import { z } from 'zod';
import { getFrontendApi, getOAuth2Api } from '@/ory/sdk/server';
import { cookies } from 'next/headers';

export async function createClient(
    formData: z.infer<typeof clientFormSchema>,
) {

    const cookie = await cookies();
    const frontendApi = await getFrontendApi();

    const session = await frontendApi
        .toSession({ cookie: 'ory_kratos_session=' + cookie.get('ory_kratos_session')?.value })
        .then((response) => response.data)
        .catch(() => null);

    if (!session) {
        console.log('Unauthorised action call');
        throw 'Unauthorised';
    }

    console.log(session.identity?.traits.email, 'posted form', formData);

    const oauthApi = await getOAuth2Api();
    return await oauthApi.createOAuth2Client({ oAuth2Client: formData });
}
