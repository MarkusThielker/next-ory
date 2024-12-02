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

    if (!session && !request.nextUrl.pathname.startsWith('/flow')) {

        console.log('NO SESSION');

        const url = request.nextUrl.host +
            '/flow/login?return_to=' +
            request.nextUrl.host +
            request.nextUrl.pathname;

        console.log('REDIRECT TO', url);

        return NextResponse.redirect(url);
    }

    if (session && request.nextUrl.pathname.startsWith('/flow')) {

        console.log('SESSION EXISTS');

        const returnTo = request.nextUrl.searchParams.get('return_to') ?? request.nextUrl.host;

        console.log('REDIRECT TO', returnTo);

        return NextResponse.redirect(returnTo);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.png|sitemap.xml|robots.txt).*)',
};
