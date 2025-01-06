import { getOAuth2Api } from '@/ory/sdk/server';
import { ClientDataTable } from '@/app/(inside)/client/data-table';

export interface FetchClientPageProps {
    pageSize: number;
    pageToken: string;
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

async function fetchClientPage({ pageSize, pageToken }: FetchClientPageProps) {
    'use server';

    const oAuth2Api = await getOAuth2Api();
    const response = await oAuth2Api.listOAuth2Clients({
        pageSize: pageSize,
        pageToken: pageToken,
    });

    return {
        data: response.data,
        tokens: parseTokens(response.headers.link),
    };
}

export default async function ListClientPage() {

    let pageSize = 100;
    let pageToken: string = '00000000-0000-0000-0000-000000000000';

    const initialFetch = await fetchClientPage({ pageSize, pageToken });

    return (
        <div className="space-y-4">
            <div>
                <p className="text-3xl font-bold leading-tight tracking-tight">OAuth2 Clients</p>
                <p className="text-lg font-light">
                    See and manage all OAuth2 clients registered with your Ory Hydra instance
                </p>
            </div>
            <ClientDataTable
                data={initialFetch.data}
                pageSize={pageSize}
                pageToken={initialFetch.tokens.get('next')}
                fetchClientPage={fetchClientPage}/>
        </div>
    );
}
