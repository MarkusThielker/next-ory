import React from 'react';
import { IdentityDataTable } from '@/app/(inside)/user/data-table';
import { getIdentityApi } from '@/ory/sdk/server';
import { SearchInput } from '@/components/search-input';

export interface FetchIdentityPageProps {
    pageSize: number;
    pageToken: string;
    query: string;
}

async function fetchIdentityPage({ pageSize, pageToken, query }: FetchIdentityPageProps) {
    'use server';

    const identityApi = await getIdentityApi();
    const response = await identityApi.listIdentities({
        pageSize: pageSize,
        pageToken: pageToken,
        previewCredentialsIdentifierSimilar: query,
    });

    return {
        data: response.data,
        tokens: parseTokens(response.headers.link),
    };
}

function parseTokens(link: string) {

    const parsed = link.split(',').map((it) => {
        const startRel = it.lastIndexOf('rel="');
        const endRel = it.lastIndexOf('"');
        const rel = it.slice(startRel, endRel);

        const startToken = it.lastIndexOf('page_token=');
        const endToken = it.lastIndexOf('&');
        const token = it.slice(startToken, endToken);

        return [rel, token];
    });

    return new Map(parsed.map(obj => [
        obj[0].replace('rel="', ''),
        obj[1].replace('page_token=', ''),
    ]));
}

export default async function UserPage(
    {
        searchParams,
    }: {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    },
) {

    const params = await searchParams;
    const query = params.query ? params.query as string : '';

    let pageSize = 250;
    let pageToken: string = '00000000-0000-0000-0000-000000000000';

    const initialFetch = await fetchIdentityPage({ pageSize, pageToken, query: query });

    return (
        <div className="space-y-4">
            <div>
                <p className="text-3xl font-bold leading-tight tracking-tight">Users</p>
                <p className="text-lg font-light">
                    See and manage all identities registered with your Ory Kratos instance
                </p>
            </div>
            <div className="space-y-2">
                <SearchInput queryParamKey="query" placeholder="Search for identifiers (Email, Username...)"/>
                <IdentityDataTable
                    data={initialFetch.data}
                    pageSize={pageSize}
                    pageToken={initialFetch.tokens.get('next')}
                    query={query}
                    fetchIdentityPage={fetchIdentityPage}/>
            </div>
        </div>
    );
}
