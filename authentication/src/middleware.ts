import { NextRequest, NextResponse } from 'next/server';
import { getFrontendApi } from '@/ory/sdk/hydra';
import { cookies } from 'next/headers';

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

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.png|sitemap.xml|robots.txt).*)',
};
