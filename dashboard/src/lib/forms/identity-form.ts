import { z } from 'zod';

// interface for a list of properties
export interface KratosSchemaProperties {
    [key: string]: {
        type: string;
        format?: string;
        title: string;
        minLength?: number;
        maxLength?: number;
        minimum?: number;
        maximum?: number;
        required?: boolean;
        description?: string;
        properties?: KratosSchemaProperties
    };
}

// interface for the kratos identity schema
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

export function generateZodSchema(properties: KratosSchemaProperties) {

    const zodSchema = z.object({});

    for (const [key, value] of Object.entries(properties)) {
        let zodType;
        switch (value.type) {
            case 'string':
                zodType = z.string();
                if (value.format === 'email') {
                    zodType = z.string().email();
                }
                if (value.minLength) {
                    zodType = zodType.min(value.minLength);
                }
                if (value.maxLength) {
                    zodType = zodType.max(value.maxLength);
                }
                break;
            case 'number':
                zodType = z.number();
                if (value.minimum) {
                    zodType = zodType.min(value.minimum);
                }
                if (value.maximum) {
                    zodType = zodType.max(value.maximum);
                }
                break;
            case 'object':
                const schemaCopy = structuredClone(schema);
                schemaCopy.properties.traits.properties = value.properties!;
                zodType = generateZodSchema(schemaCopy);
                break;
            default:
                zodType = z.any();
        }

        if (!value.required) {
            zodType = zodType.nullable();
        }

        zodSchema.extend({ [key]: zodType });
    }

    return zodSchema;
}
