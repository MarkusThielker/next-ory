import React from 'react';
import { IdentityDataTable } from '@/app/(inside)/user/data-table';
import { SearchInput } from '@/components/search-input';
import { queryIdentities } from '@/lib/action/identity';
import { IdentityPagination } from '@/components/pagination';

export default async function UserPage(
    {
        searchParams,
    }: {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    },
) {

    const params = await searchParams;

    const page = params.page ? Number(params.page) : 1;
    const query = params.query ? params.query as string : '';

    let pageSize = 50;
    let paginationRange = 11;

    const { data, itemCount, pageCount } = await queryIdentities({ page, pageSize, query });

    return (
        <div className="space-y-4">
            <div>
                <p className="text-3xl font-bold leading-tight tracking-tight">Users</p>
                <p className="text-lg font-light">
                    See and manage all identities registered with your Ory Kratos instance
                </p>
            </div>
            <div className="space-y-2">
                <SearchInput
                    value={query}
                    pageParamKey="page"
                    queryParamKey="query"
                    placeholder="Search for addresses and traits"/>
                <div>
                    <p className="text-xs text-neutral-500">{itemCount} item{itemCount && itemCount > 1 ? 's' : ''} found</p>
                    <IdentityDataTable
                        data={data}
                        page={page}
                        query={query}/>
                </div>
                <IdentityPagination
                    page={page}
                    pageCount={pageCount}
                    pageParamKey="page"
                    paginationRange={paginationRange}/>
            </div>
        </div>
    );
}
