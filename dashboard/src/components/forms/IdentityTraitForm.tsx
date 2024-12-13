'use client';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { generateZodSchema, KratosSchema, KratosSchemaProperties } from '@/lib/forms/identity-form';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Identity } from '@ory/client';

interface IdentityTraitFormProps {
    schema: KratosSchema;
    identity: Identity;
}

function renderUiNodes(form: UseFormReturn, properties: KratosSchemaProperties, prefix?: string): any {

    let keyPrefix = prefix ? prefix + '.' : '';

    return Object.entries(properties).map(([key, value]) => {
            if (value.type === 'object') {
                return renderUiNodes(form, value.properties!, key);
            } else {
                return (
                    <FormField
                        control={form.control}
                        name={keyPrefix + key}
                        key={key}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{value.title}</FormLabel>
                                <FormControl>
                                    <Input placeholder={value.title} readOnly {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                );
            }
        },
    );
}

export function IdentityTraitForm({ schema, identity }: IdentityTraitFormProps) {

    const zodIdentitySchema = generateZodSchema(schema);
    const form = useForm<z.infer<typeof zodIdentitySchema>>({
        defaultValues: identity.traits,
        resolver: zodResolver(zodIdentitySchema),
    });

    function onSubmit(values: z.infer<typeof zodIdentitySchema>) {
        toast.message(JSON.stringify(values, null, 4));
    }

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
                {
                    renderUiNodes(form, schema.properties.traits.properties)
                }
            </form>
        </Form>
    );
}
