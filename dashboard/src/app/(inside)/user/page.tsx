import React from 'react';
import { IdentityDataTable } from '@/app/(inside)/user/data-table';
import { SearchInput } from '@/components/search-input';
import { queryIdentities } from '@/lib/action/identity';
import { IdentityPagination } from '@/components/pagination';
import { checkPermission, requirePermission, requireSession } from '@/lib/action/authentication';
import InsufficientPermission from '@/components/insufficient-permission';
import { permission, relation } from '@/lib/permission';

export default async function UserPage(
    {
        searchParams,
    }: {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    },
) {

    const session = await requireSession();
    const identityId = session.identity!.id;

    await requirePermission(permission.stack.dashboard, relation.access, identityId);

    const pmAccessUser = await checkPermission(permission.user.it, relation.access, identityId);
    const pmEditUser = await checkPermission(permission.user.it, relation.edit, identityId);
    const pmDeleteUser = await checkPermission(permission.user.it, relation.delete, identityId);
    const pmEditUserState = await checkPermission(permission.user.state, relation.edit, identityId);
    const pmDeleteUserSession = await checkPermission(permission.user.session, relation.delete, identityId);

    const params = await searchParams;

    const page = params.page ? Number(params.page) : 1;
    const query = params.query ? params.query as string : '';

    let pageSize = 50;
    let paginationRange = 11;

    const users = pmAccessUser && await queryIdentities(page, pageSize, query);

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
                            permission={permission.user.it}
                            relation={relation.access}
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
                                        pmDeleteUser: pmDeleteUser,
                                        pmEditUserState: pmEditUserState,
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
