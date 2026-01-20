import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const response = NextResponse.next();

    // If it's an admin path and not the login page
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        const authCookie = request.cookies.get('admin_auth')
        const correctPassword = process.env.ADMIN_PASSWORD || "Hadari1612"

        // Simple check for the specific password as the cookie value
        if (!authCookie || authCookie.value !== correctPassword) {
            const url = request.nextUrl.clone()
            url.pathname = '/admin/login'
            return NextResponse.redirect(url)
        }
    }

    // Add Secure Headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

    return response;
}

export const config = {
    matcher: ['/admin/:path*'],
}
