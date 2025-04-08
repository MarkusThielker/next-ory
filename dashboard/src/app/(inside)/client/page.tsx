import { getOAuth2Api } from '@/ory/sdk/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { checkPermission, requireSession } from '@/lib/action/authentication';
import { permission, relation } from '@/lib/permission';
import InsufficientPermission from '@/components/insufficient-permission';
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

    const session = await requireSession();
    const allowed = await checkPermission(permission.client.it, relation.access, session.identity!.id);
    if (!allowed) {
        throw Error('Unauthorised');
    }

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

    const session = await requireSession();
    const identityId = session.identity!.id;

    const pmAccessClient = await checkPermission(permission.client.it, relation.access, identityId);
    const pmCreateClient = await checkPermission(permission.client.it, relation.create, identityId);

    let pageSize = 100;
    let pageToken: string = '00000000-0000-0000-0000-000000000000';

    const initialFetch = pmAccessClient && await fetchClientPage({ pageSize, pageToken });

    return (
        <div className="space-y-4">
            <div className="relative">
                <p className="text-3xl font-bold leading-tight tracking-tight">OAuth2 Clients</p>
                <p className="text-lg font-light">
                    See and manage all OAuth2 clients registered with your Ory Hydra instance
                </p>
                {
                    pmCreateClient && (
                        <Button className="absolute bottom-0 right-0" asChild>
                            <Link href="/client/create">
                                Create new client
                            </Link>
                        </Button>
                    )
                }
            </div>
            {
                pmAccessClient ?
                    (
                        initialFetch && <ClientDataTable
                            data={initialFetch.data}
                            pageSize={pageSize}
                            pageToken={initialFetch.tokens.get('next')}
                            fetchClientPage={fetchClientPage}/>
                    )
                    :
                    <InsufficientPermission
                        permission={permission.client.it}
                        relation={relation.access}
                        identityId={identityId}/>
            }
        </div>
    );
}
