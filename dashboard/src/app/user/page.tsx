import React, { Suspense } from 'react';
import { DataTableFallback } from '@/components/ui/data-table-fallback';
import { IdentityDataTable } from '@/app/user/data-table';
import { getIdentityApi } from '@/ory/sdk/server';

export default async function UserPage() {

    const identityApi = await getIdentityApi();

    const { data } = await identityApi.listIdentities();

    return (
        <div className="flex flex-col space-y-4">
            <div>
                <p className="text-3xl font-bold leading-tight tracking-tight">Users</p>
                <p className="text-lg font-light">See and manage all identities registered with your Ory Kratos
                    instance</p>
            </div>

            <Suspense fallback={<DataTableFallback columnCount={5} rowCount={20}/>}>
                <IdentityDataTable data={data}/>
            </Suspense>
        </div>
    );
}
