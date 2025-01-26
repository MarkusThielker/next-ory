import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getFrontendApi } from '@/ory/sdk/server';

export async function middleware(request: NextRequest) {

    const api = await getFrontendApi();
    const cookie = await cookies();

    const session = await api
        .toSession({ cookie: 'ory_kratos_session=' + cookie.get('ory_kratos_session')?.value })
        .then((response) => response.data)
        .catch(() => null);


    const forwardedHost = request.headers.get('x-forwarded-host');
    const hostHeader = request.headers.get('host');
    const nodeHost = forwardedHost
        ? `${request.nextUrl.protocol}//${forwardedHost}`
        : hostHeader
            ? `${request.nextUrl.protocol}//${hostHeader}`
            : `${request.nextUrl.protocol}//${request.nextUrl.host}`;


    if (!session && !request.nextUrl.pathname.startsWith('/flow')) {
        console.log('NO SESSION');
        const fullReturnUrl = `${nodeHost}${request.nextUrl.pathname}${request.nextUrl.search}`;

        const url = nodeHost + '/flow/login?return_to=' + fullReturnUrl;

        console.log('REDIRECT TO', url);

        return NextResponse.redirect(url);
    }

    if (session && request.nextUrl.pathname.startsWith('/flow')) {

        console.log('SESSION EXISTS');

        const returnTo = request.nextUrl.searchParams.get('return_to') ?? nodeHost;

        console.log('REDIRECT TO', returnTo);

        return NextResponse.redirect(returnTo);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.png|sitemap.xml|robots.txt|sw.js|manifest.json|icon-72.png|icon-128.png|icon-144.png|icon-192.png|icon-512.png|mt-logo-orange.png).*)',
};
