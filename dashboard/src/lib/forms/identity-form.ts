'use client';

import { z } from 'zod';

export const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
    z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

// Interface for a list of properties
export interface KratosSchemaProperties {
    [key: string]: {
        type: 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null';
        format?: string;
        title: string;
        minLength?: number;
        maxLength?: number;
        minimum?: number;
        maximum?: number;
        required: boolean;
        description?: string;
        properties?: KratosSchemaProperties;
        enum?: any[];
        pattern?: string;
        items?: KratosSchemaProperties;
        oneOf?: KratosSchemaProperties[];
        anyOf?: KratosSchemaProperties[];
        allOf?: KratosSchemaProperties[];
        dependencies?: { [key: string]: string[] | KratosSchemaProperties };
        additionalProperties?: boolean;
    };
}

// Interface for the Kratos identity schema
export interface KratosSchema {
    $id: string;
    $schema: string;
    title: string;
    type: 'object';
    properties: {
        traits: {
            type: 'object';
            properties: KratosSchemaProperties;
            required: string[];
            additionalProperties: boolean;
        };
    };
}

export function kratosSchemaToZod(schema: KratosSchema): z.ZodObject<any> {

    // Function to recursively convert Kratos properties to Zod types
    function convertProperties(properties: KratosSchemaProperties): { [key: string]: z.ZodTypeAny } {
        const zodProps: { [key: string]: z.ZodTypeAny } = {};
        for (const key in properties) {
            const prop = properties[key];

            let zodType;
            switch (prop.type) {
                case 'string':
                    zodType = z.string();
                    if (prop.format === 'email') zodType = zodType.email();
                    if (prop.minLength) zodType = zodType.min(prop.minLength);
                    if (prop.maxLength) zodType = zodType.max(prop.maxLength);
                    if (prop.pattern) zodType = zodType.regex(new RegExp(prop.pattern));
                    break;
                case 'number':
                case 'integer':
                    zodType = z.number();
                    if (prop.minimum) zodType = zodType.min(prop.minimum);
                    if (prop.maximum) zodType = zodType.max(prop.maximum);
                    break;
                case 'boolean':
                    zodType = z.boolean();
                    break;
                case 'object':
                    zodType = z.object(convertProperties(prop.properties || {}));
                    break;
                case 'array':
                    zodType = z.array(
                        prop.items ? kratosSchemaToZod({ properties: { item: prop.items } } as any).shape.item : z.any(),
                    );
                    break;
                default:
                    zodType = z.any(); // Fallback to any for unknown types
            }

            if (prop.enum) zodType = zodType.refine((val) => prop.enum!.includes(val));

            zodProps[key] = zodType;
        }
        return zodProps;
    }

    return z.object(convertProperties(schema.properties.traits.properties));
}
