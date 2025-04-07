'use client';

import { KratosSchema, kratosSchemaToZod } from '@/lib/forms/identity-form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Identity } from '@ory/client';
import { toast } from 'sonner';
import DynamicForm from '@/components/dynamic-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { zu } from 'zod_utilz';
import { updateIdentity } from '@/lib/action/identity';
import { useState } from 'react';

interface IdentityTraitFormProps {
    schema: KratosSchema;
    identity: Identity;
    disabled: boolean;
}

export function IdentityTraits({ schema, identity, disabled }: IdentityTraitFormProps) {

    const [currentIdentity, setCurrentIdentity] = useState(identity);

    const generated = kratosSchemaToZod(schema);
    const metadata = z.object({
        metadata_public: zu.stringToJSON(),
        metadata_admin: zu.stringToJSON(),
    });

    const zodIdentitySchema = generated.merge(metadata);

    const form = useForm<z.infer<typeof zodIdentitySchema>>({
        resolver: zodResolver(zodIdentitySchema),
        defaultValues: {
            ...currentIdentity.traits,
            metadata_public: currentIdentity.metadata_public ?
                JSON.stringify(currentIdentity.metadata_public) : '{}',
            metadata_admin: currentIdentity.metadata_admin ?
                JSON.stringify(currentIdentity.metadata_admin) : '{}',
        },
    });

    const onValid = (data: z.infer<typeof zodIdentitySchema>) => {

        const traits = structuredClone(data);
        delete traits['metadata_public'];
        delete traits['metadata_admin'];

        updateIdentity(
            currentIdentity.id,
            {
                schema_id: currentIdentity.schema_id,
                state: currentIdentity.state!,
                traits: traits,
                metadata_public: data.metadata_public,
                metadata_admin: data.metadata_admin,
            },
        )
            .then((identity) => {
                setCurrentIdentity(identity);
                toast.success('Identity updated');
            })
            .catch(() => {
                toast.error('Updating identity failed');
            });
    };

    const onInvalid = (data: z.infer<typeof zodIdentitySchema>) => {
        console.log('data', data);
        toast.error('Invalid values');
    };

    return (
        <DynamicForm
            form={form}
            disabled={disabled}
            properties={schema.properties.traits.properties}
            onValid={onValid}
            onInvalid={onInvalid}
            submitLabel={disabled ? 'Insufficient permissions' : 'Update Identity'}
        >
            <FormField
                {...form.register('metadata_public')}
                key={'metadata_public'}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Public Metadata</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Public Metadata" {...field} disabled={disabled}/>
                        </FormControl>
                        <FormDescription>This has to be valid JSON</FormDescription>
                    </FormItem>
                )}
            />
            <FormField
                {...form.register('metadata_admin')}
                key={'metadata_admin'}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Admin Metadata</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Admin Metadata" {...field} disabled={disabled}/>
                        </FormControl>
                        <FormDescription>This has to be valid JSON</FormDescription>
                    </FormItem>
                )}
            />
        </DynamicForm>
    );
}
