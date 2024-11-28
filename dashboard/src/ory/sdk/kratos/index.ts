'use client';

import { Configuration, FrontendApi } from '@ory/client';

const kratos = new FrontendApi(
    new Configuration({
        basePath: process.env.NEXT_PUBLIC_ORY_KRATOS_URL,
        baseOptions: {
            withCredentials: true,
        },
    }),
);

export { kratos };
