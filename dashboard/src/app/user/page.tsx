import React, { Suspense } from 'react';
import { DataTableFallback } from '@/components/ui/data-table-fallback';
import { IdentityDataTable } from '@/app/user/data-table';
import { getIdentityApi } from '@/ory/sdk/server';
import { SearchInput } from '@/components/search-input';

export default async function UserPage(
    {
        searchParams,
    }: {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    },
) {

    const identityApi = await getIdentityApi();

    const params = await searchParams;
    const query = params.query ? params.query as string : '';

    const data = await identityApi.listIdentities({
        pageSize: 100,
        previewCredentialsIdentifierSimilar: query,
    }).then(response => response.data);

    return (
        <div className="flex flex-col space-y-4">
            <div>
                <p className="text-3xl font-bold leading-tight tracking-tight">Users</p>
                <p className="text-lg font-light">See and manage all identities registered with your Ory Kratos
                    instance</p>
            </div>
            <div className="flex flex-col space-y-2">
                <SearchInput queryParamKey="query" placeholder="Search"/>
                <Suspense fallback={<DataTableFallback columnCount={5} rowCount={20}/>}>
                    <IdentityDataTable data={data}/>
                </Suspense>
            </div>
        </div>
    );
}
