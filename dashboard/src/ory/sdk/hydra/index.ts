'use server';

import { Configuration, OAuth2Api } from '@ory/client';

// implemented as a function because of 'use server'
export default async function getHydra() {
    return new OAuth2Api(new Configuration(
        new Configuration({
            basePath: process.env.ORY_HYDRA_ADMIN_URL,
            baseOptions: {
                withCredentials: true,
            },
        }),
    ));
}