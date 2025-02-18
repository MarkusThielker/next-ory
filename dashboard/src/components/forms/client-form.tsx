'use client';

import { z } from 'zod';
import { clientFormSchema } from '@/lib/forms/client-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { OAuth2Client } from '@ory/client';
import { AxiosResponse } from 'axios';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';

interface CreateClientFormProps {
    action: (data: z.infer<typeof clientFormSchema>) => Promise<AxiosResponse<OAuth2Client, any>>;
}

export function CreateClientForm({ action }: CreateClientFormProps) {

    const router = useRouter();

    const form = useForm<z.infer<typeof clientFormSchema>>({
        resolver: zodResolver(clientFormSchema),
        defaultValues: {
            client_name: '',
            owner: '',
            scope: '',
            skip: false,
            logo_uri: '',
            policy_uri: '',
            tos_uri: '',
        },
    });

    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [createdClient, setCreatedClient] = useState<OAuth2Client>();
    const handleSubmit = async (data: z.infer<typeof clientFormSchema>) => {
        await action(data)
            .then((response) => {
                console.log(response);
                return response.data;
            })
            .then((client) => {
                setCreatedClient(client);
                setSuccessDialogOpen(true);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <>
            {
                createdClient && (
                    <AlertDialog open={successDialogOpen} onOpenChange={() => setSuccessDialogOpen(false)}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Client created</AlertDialogTitle>
                            </AlertDialogHeader>
                            Your client was created successfully. Make sure to safe the client secret!
                            <Input value={createdClient.client_secret} readOnly/>
                        </AlertDialogContent>
                    </AlertDialog>
                )
            }
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Essentials
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="client_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Client Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ACME INC SSO" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            The human-readable name of the client to be presented to the end-user
                                            during
                                            authorization.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="scope"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Scopes</FormLabel>
                                        <FormControl>
                                            <Input placeholder="post:read post:write user:read" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Scope is a string containing a space-separated list of scope values (as
                                            described in
                                            Section 3.3 of OAuth 2.0 [RFC6749]) that the client can use when
                                            requesting
                                            access
                                            tokens.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="scope"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Scopes</FormLabel>
                                        <FormControl>
                                            <Input placeholder="post:read post:write user:read" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Scope is a string containing a space-separated list of scope values (as
                                            described in
                                            Section 3.3 of OAuth 2.0 [RFC6749]) that the client can use when
                                            requesting
                                            access
                                            tokens.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Consent Screen
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="skip"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Skip consent
                                            </FormLabel>
                                            <FormDescription>
                                                Whether or not the consent screen is skipped for this client
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {
                                !form.getValues('skip') && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="logo_uri"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Logo URI</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="https://myapp.example/logo.png" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        A URL string referencing the client's logo.
                                                    </FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="policy_uri"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Policy URI</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="https://myapp.example/privacy_policy" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        A URL string pointing to a human-readable
                                                        privacy policy document for the client that describes how the
                                                        deployment organization collects, uses, retains, and discloses
                                                        personal data.
                                                    </FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="tos_uri"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Terms URI</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="https://myapp.example/terms_of_service" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        A URL string pointing to a human-readable terms of service
                                                        document for the client that describes a contractual
                                                        relationship between the end-user and the client that the
                                                        end-user accepts when authorizing the client.
                                                    </FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="owner"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Owner</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="ACME INC" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Owner is a string identifying the owner of the OAuth 2.0 Client.
                                                    </FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )
                            }
                        </CardContent>
                    </Card>

                    <div className="space-x-2">
                        <Button type="button" variant="outline" onClick={() => {
                            router.back();
                        }}>Cancel</Button>
                        <Button type="submit">Create client</Button>
                    </div>
                </form>
            </Form>
        </>
    );
}
