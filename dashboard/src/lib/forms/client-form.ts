import { z } from 'zod';

export const clientFormSchema = z.object({
    access_token_strategy: z.string().default('opaque').readonly(),
    client_name: z.string().min(1, 'Client name is required'),
    scope: z.string(),
    redirect_uris: z.array(z.string().url({ message: 'Invalid URL' })).min(1, { message: 'At least one redirect URI is required' }),
    skip: z.boolean(),
    logo_uri: z.string().url(),
    tos_uri: z.string().url(),
    policy_uri: z.string().url(),
    owner: z.string().min(1, 'Owner is required'),
    grant_types: z.array(z.string()),
    response_types: z.array(z.string()),
    token_endpoint_auth_method: z.string(),
});
