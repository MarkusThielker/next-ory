'use client';

import { getNodeLabel } from '@ory/integrations/ui';

import { NodeInputProps } from './helpers';
import { Button } from '@/components/ui/button';

export function NodeInputSubmit<T>(
    {
        node,
        attributes,
        disabled,
    }: NodeInputProps,
) {
    return (
        <Button
            name={attributes.name}
            value={attributes.value || ''}
            disabled={attributes.disabled || disabled}
        >
            {getNodeLabel(node)}
        </Button>
    );
}
