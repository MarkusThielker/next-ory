'use client';

import { ColumnDef } from '@tanstack/react-table';
import { OAuth2Client } from '@ory/client';
import { DataTable } from '@/components/ui/data-table';
import { useEffect, useRef, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { FetchClientPageProps } from '@/app/(inside)/client/page';

interface ClientDataTableProps {
    data: OAuth2Client[];
    pageSize: number;
    pageToken: string | undefined;
    fetchClientPage: (props: FetchClientPageProps) => Promise<{
        data: OAuth2Client[],
        tokens: Map<string, string>
    }>;
}

export function ClientDataTable(
    {
        data,
        pageSize,
        pageToken,
        fetchClientPage,
    }: ClientDataTableProps,
) {

    console.log('OAuth2 client', data);

    const columns: ColumnDef<OAuth2Client>[] = [
        {
            id: 'client_id',
            accessorKey: 'client_id',
            header: 'Client ID',
        },
        {
            id: 'client_name',
            accessorKey: 'client_name',
            header: 'Client Name',
        },
        {
            id: 'owner',
            accessorKey: 'owner',
            header: 'Owner',
        },
    ];

    const [items, setItems] = useState<OAuth2Client[]>(data);
    const [nextToken, setNextToken] = useState<string | undefined>(pageToken);

    // react on changes from ssr (query params)
    useEffect(() => {
        setItems(data);
        setNextToken(pageToken);
    }, [data, pageSize, pageToken]);

    // infinite scroll handling
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

    const fetchMore = async () => {
        if (!nextToken) return;

        const response = await fetchClientPage({
            pageSize: pageSize,
            pageToken: nextToken,
        });

        setItems([...items, ...response.data]);
        setNextToken(response.tokens.get('next') ?? undefined);
    };

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
