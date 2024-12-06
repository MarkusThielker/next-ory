'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Identity } from '@ory/client';
import { DataTable } from '@/components/ui/data-table';
import { CircleCheck, CircleX } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface IdentityDataTableProps {
    data: Identity[];
}

export function IdentityDataTable({ data }: IdentityDataTableProps) {

    const columns: ColumnDef<Identity>[] = [
        {
            id: 'id',
            accessorKey: 'id',
            header: 'ID',
        },
        {
            id: 'active',
            header: 'Active',
            cell: ({ row }) => {

                const identity = row.original;

                if (identity.state === 'active') {
                    return <CircleCheck/>;
                } else {
                    return <CircleX/>;
                }
            },
        },
        {
            id: 'name',
            accessorKey: 'traits.name',
            header: 'Name',
        },
        {
            id: 'email',
            header: 'Email',
            cell: ({ row }) => {

                const identity = row.original;
                const email = identity.verifiable_addresses ?
                    identity.verifiable_addresses[0] : undefined;

                if (!email) {
                    return <p>Something went wrong</p>;
                } else {
                    return (
                        <div className="flex flex-row space-x-2 items-center">
                            <span>{email.value}</span>
                            {
                                email.verified ?
                                    <HoverCard>
                                        <HoverCardTrigger>
                                            <CircleCheck/>
                                        </HoverCardTrigger>
                                        <HoverCardContent>
                                            <span>This email was confirmed at </span>
                                            {new Date(email.verified_at!!).toLocaleString()}
                                        </HoverCardContent>
                                    </HoverCard>
                                    :
                                    <HoverCard>
                                        <HoverCardTrigger>
                                            <CircleX/>
                                        </HoverCardTrigger>
                                        <HoverCardContent>
                                            This email is not confirmed yet
                                        </HoverCardContent>
                                    </HoverCard>
                            }
                        </div>
                    );
                }
            },
        },
    ];

    return <DataTable columns={columns} data={data}/>;
}
