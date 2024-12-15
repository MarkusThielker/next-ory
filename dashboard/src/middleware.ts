import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getFrontendApi, getPermissionApi } from '@/ory/sdk/server';

export async function middleware(request: NextRequest) {

    const frontendApi = await getFrontendApi();
    const cookie = await cookies();

    const session = await frontendApi
        .toSession({ cookie: 'ory_kratos_session=' + cookie.get('ory_kratos_session')?.value })
        .then((response) => response.data)
        .catch(() => null);

    if (!session) {

        console.log('NO SESSION');

        const url = process.env.NEXT_PUBLIC_AUTHENTICATION_NODE_URL +
            '/flow/login?return_to=' +
            process.env.NEXT_PUBLIC_DASHBOARD_NODE_URL;

        console.log('REDIRECT TO', url);

        return NextResponse.redirect(url);
    }

    if (request.nextUrl.pathname === '/unauthorised') {
        return NextResponse.next();
    }

    const permissionApi = await getPermissionApi();
    const isAdmin = await permissionApi.checkPermission({
        namespace: 'roles',
        object: 'admin',
        relation: 'member',
        subjectId: session!.identity!.id,
    })
        .then(({ data: { allowed } }) => {
            console.log('is_admin', session!.identity!.id, allowed);
            return allowed;
        })
        .catch((response) => {
            console.log('is_admin', session!.identity!.id, response, 'check failed');
            return false;
        });

    if (isAdmin) {
        return NextResponse.next();
    } else {
        console.log('MISSING PERMISSION');
        const url = `${process.env.NEXT_PUBLIC_DASHBOARD_NODE_URL}/unauthorised`;
        console.log('REDIRECT TO', url);
        return NextResponse.redirect(url!);
    }
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.png|sitemap.xml|robots.txt).*)',
};
