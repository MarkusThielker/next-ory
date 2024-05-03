'use client';

import { UiNode, UiNodeAnchorAttributes } from '@ory/client';
import { Button } from '@/components/ui/button';

interface Props {
    node: UiNode;
    attributes: UiNodeAnchorAttributes;
}

export const NodeAnchor = ({ node, attributes }: Props) => {
    return (
        <Button
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                window.location.href = attributes.href;
            }}
        >
            {attributes.title.text}
        </Button>
    );
};
