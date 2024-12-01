'use server';

import { Configuration, FrontendApi, IdentityApi, MetadataApi, OAuth2Api } from '@ory/client';


// ####################################################################################
// OAuth2 API
// ####################################################################################

const oAuth2Api = new OAuth2Api(new Configuration(
    {
        basePath: process.env.ORY_HYDRA_ADMIN_URL,
        baseOptions: {
            withCredentials: true,
        },
    },
));

export async function getOAuth2Api() {
    return oAuth2Api;
}


// ####################################################################################
// Hydra Metadata API
// ####################################################################################

const hydraMetadataApi = new MetadataApi(new Configuration(
    {
        basePath: process.env.ORY_HYDRA_ADMIN_URL,
        baseOptions: {
            withCredentials: true,
        },
    },
));

export async function getHydraMetadataApi() {
    return hydraMetadataApi;
}


// ####################################################################################
// Frontend API
// ####################################################################################

const frontendApi = new FrontendApi(
    new Configuration({
        basePath: process.env.NEXT_PUBLIC_ORY_KRATOS_URL,
        baseOptions: {
            withCredentials: true,
        },
    }),
);

export async function getFrontendApi() {
    return frontendApi;
}


// ####################################################################################
// Identity API
// ####################################################################################

const identityApi = new IdentityApi(new Configuration(
    {
        basePath: process.env.ORY_KRATOS_ADMIN_URL,
        baseOptions: {
            withCredentials: true,
        },
    },
));

export async function getIdentityApi() {
    return identityApi;
}


// ####################################################################################
// Kratos Metadata API
// ####################################################################################

const kratosMetadataApi = new MetadataApi(
    new Configuration(
        {
            basePath: process.env.ORY_KRATOS_ADMIN_URL,
            baseOptions: {
                withCredentials: true,
            },
        },
    ));

export async function getKratosMetadataApi() {
    return kratosMetadataApi;
}
