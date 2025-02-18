import { z } from 'zod';

export const clientFormSchema = z.object({
    access_token_strategy: z.string().default('opaque').readonly(),
    client_name: z.string().min(1, 'Client name is required'),
    owner: z.string().min(1, 'Owner is required'),
    scope: z.string(),
    skip: z.boolean(),
    logo_uri: z.string().url(),
    tos_uri: z.string().url(),
    policy_uri: z.string().url(),
});
