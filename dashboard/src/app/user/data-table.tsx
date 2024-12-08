'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Identity } from '@ory/client';
import { DataTable } from '@/components/ui/data-table';
import { CircleCheck, CircleX } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useEffect, useRef, useState } from 'react';
import { FetchIdentityPageProps } from '@/app/user/page';
import { Spinner } from '@/components/ui/spinner';

interface IdentityDataTableProps {
    data: Identity[];
    pageSize: number;
    pageToken: string | undefined;
    query: string;
    fetchIdentityPage: (props: FetchIdentityPageProps) => Promise<{ data: Identity[], tokens: Map<string, string> }>;
}

export function IdentityDataTable({ data, pageSize, pageToken, query, fetchIdentityPage }: IdentityDataTableProps) {

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

    const [items, setItems] = useState<Identity[]>(data);
    const [nextToken, setNextToken] = useState<string | undefined>(pageToken);

    useEffect(() => {
        setItems(data);
        setNextToken(pageToken);
    }, [data, pageSize, pageToken, query]);

    const fetchMore = async () => {
        if (!nextToken) return;

        const response = await fetchIdentityPage({
            pageSize: pageSize,
            pageToken: nextToken,
            query: query,
        });

        setItems([...items, ...response.data]);
        setNextToken(response.tokens.get('next') ?? undefined);
    };

    const infiniteScrollSensor = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchMore();
                }
            },
            { threshold: 0.5 }, // Adjust threshold as needed
        );

        if (infiniteScrollSensor.current) {
            observer.observe(infiniteScrollSensor.current);
        }

        return () => {
            if (infiniteScrollSensor.current) {
                observer.unobserve(infiniteScrollSensor.current);
            }
        };
    }, [items]);

    return (
        <>
            <DataTable columns={columns} data={items}/>
            {
                nextToken && (
                    <div className="flex w-full justify-center">
                        <Spinner ref={infiniteScrollSensor} className="h-10"/>
                    </div>
                )
            }
        </>
    );
}
