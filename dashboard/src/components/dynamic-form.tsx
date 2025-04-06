'use client';

import { FieldValues, Path, SubmitErrorHandler, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { ReactNode } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { KratosSchemaProperties } from '@/lib/forms/identity-form';

interface DynamicFormProps<T extends FieldValues> {
    children?: ReactNode,
    form: UseFormReturn<T>,
    properties: KratosSchemaProperties,
    onValid: SubmitHandler<T>,
    onInvalid: SubmitErrorHandler<T>,
    submitLabel?: string,
    disabled?: boolean,
}

export function DynamicForm<T extends FieldValues>(
    {
        children,
        form,
        properties,
        onValid,
        onInvalid,
        submitLabel,
        disabled,
    }: DynamicFormProps<T>,
) {

    const generateFormFields = (data: KratosSchemaProperties, prefix = '') => {
        return (
            <React.Fragment key={prefix}>
                {
                    data && Object.entries(data).map(([key, value]) => {

                        const fullFieldName = prefix ? `${prefix}.${key}` : key;

                        if (value.type === 'object') {

                            return generateFormFields(value.properties!, fullFieldName);

                        } else if (value.type === 'boolean') {

                            return (
                                <FormField
                                    {...form.register(fullFieldName as Path<T>)}
                                    key={fullFieldName}
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <Checkbox {...field} disabled={disabled} checked={field.value}/>
                                            <FormLabel>{key}</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            );

                        } else {

                            return (
                                <FormField
                                    {...form.register(fullFieldName as Path<T>)}
                                    key={fullFieldName}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{value.title}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={value.title} {...field} disabled={disabled}/>
                                            </FormControl>
                                            <FormDescription>{value.description}</FormDescription>
                                        </FormItem>
                                    )}
                                />
                            );
                        }
                    })
                }
            </React.Fragment>
        );
    };

    return (
        <Form {...form}>
            <form className="grid grid-cols-1 gap-2" onSubmit={form.handleSubmit(onValid, onInvalid)}>
                {generateFormFields(properties)}
                {children}
                <Button
                    key="submit"
                    type="submit"
                    disabled={!form.formState.isDirty || disabled}
                >
                    {submitLabel ?? 'Submit'}
                </Button>
            </form>
        </Form>
    );
}

export default DynamicForm;
