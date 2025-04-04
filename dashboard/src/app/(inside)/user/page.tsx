import React from 'react';
import { IdentityDataTable } from '@/app/(inside)/user/data-table';
import { SearchInput } from '@/components/search-input';
import { queryIdentities } from '@/lib/action/identity';
import { IdentityPagination } from '@/components/pagination';
import { checkPermission, requireRole, requireSession } from '@/lib/action/authentication';
import InsufficientPermission from '@/components/insufficient-permission';

export default async function UserPage(
    {
        searchParams,
    }: {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    },
) {

    const session = await requireSession();
    const identityId = session.identity!.id;

    await requireRole('admin', identityId);

    const pmAccessUser = await checkPermission('admin.user', 'access', identityId);
    const pmEditUser = await checkPermission('admin.user', 'edit', identityId);
    const pmBlockUser = await checkPermission('admin.user', 'block', identityId);
    const pmUnblockUser = await checkPermission('admin.user', 'unblock', identityId);
    const pmDeleteUser = await checkPermission('admin.user', 'delete', identityId);
    const pmDeleteUserSession = await checkPermission('admin.user.session', 'delete', identityId);

    const params = await searchParams;

    const page = params.page ? Number(params.page) : 1;
    const query = params.query ? params.query as string : '';

    let pageSize = 50;
    let paginationRange = 11;

    const users = pmAccessUser && await queryIdentities({ page, pageSize, query });

    return (
        <div className="space-y-4">
            <div>
                <p className="text-3xl font-bold leading-tight tracking-tight">Users</p>
                <p className="text-lg font-light">
                    See and manage all identities registered with your Ory Kratos instance
                </p>
            </div>
            <div className="space-y-2">
                {
                    !pmAccessUser && (
                        <InsufficientPermission
                            permission="admin.user"
                            relation="see"
                            identityId={identityId}
                        />
                    )
                }
                {
                    pmAccessUser && users && (
                        <>
                            <SearchInput
                                value={query}
                                pageParamKey="page"
                                queryParamKey="query"
                                placeholder="Search for addresses and traits"/>
                            <div>
                                <p className="text-xs text-neutral-500">{users.itemCount} item{users.itemCount && users.itemCount > 1 ? 's' : ''} found</p>
                                <IdentityDataTable
                                    data={users.data}
                                    page={page}
                                    query={query}
                                    permission={{
                                        pmEditUser: pmEditUser,
                                        pmBlockUser: pmBlockUser,
                                        pmUnblockUser: pmUnblockUser,
                                        pmDeleteUser: pmDeleteUser,
                                        pmDeleteUserSession: pmDeleteUserSession,
                                    }}
                                />
                            </div>
                            <IdentityPagination
                                page={page}
                                pageCount={users.pageCount}
                                pageParamKey="page"
                                paginationRange={paginationRange}/>
                        </>
                    )
                }
            </div>
        </div>
    );
}
