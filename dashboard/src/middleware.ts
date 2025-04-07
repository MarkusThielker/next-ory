import { NextRequest, NextResponse } from 'next/server';
import { checkPermission, getSession } from '@/lib/action/authentication';
import { permission, relation } from '@/lib/permission';

export async function middleware(request: NextRequest) {

    // middleware can not work with requireSession, requireRole and
    // requirePermission due to the different redirect mechanisms in use!

    const session = await getSession();
    if (!session) {

        console.log('middleware', 'MISSING SESSION');

        const url = process.env.NEXT_PUBLIC_AUTHENTICATION_NODE_URL +
            '/flow/login?return_to=' +
            process.env.NEXT_PUBLIC_DASHBOARD_NODE_URL;

        console.log('middleware', 'REDIRECT TO', url);
        return NextResponse.redirect(url!);
    }

    const allowed = await checkPermission(permission.stack.dashboard, relation.access, session.identity!.id);


    if (allowed) {
        if (request.nextUrl.pathname === '/unauthorised') {
            return redirect('/', 'HAS PERMISSION BUT ACCESSING /unauthorized');
        }
        return NextResponse.next();
    } else {
        if (request.nextUrl.pathname === '/unauthorised') {
            return NextResponse.next();
        }
        return redirect('/unauthorised', 'MISSING SESSION');
    }
}

function redirect(path: string, reason: string) {
    console.log('middleware', reason);
    const url = `${process.env.NEXT_PUBLIC_DASHBOARD_NODE_URL}${path}`;
    console.log('middleware', 'REDIRECT TO', url);
    return NextResponse.redirect(url!);
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.png|sitemap.xml|robots.txt).*)',
};
