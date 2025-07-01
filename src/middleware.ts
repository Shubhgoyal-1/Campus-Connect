import { NextRequest, NextResponse } from 'next/server'
export { default } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'

const authPages = ['/', '/sign-in', '/sign-up'];
export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request });
    const url = request.nextUrl
    //agar token hai toh signin wagera pe kyu hi jaana h 
    if (
        token &&
        (
            authPages.includes(url.pathname) ||
            url.pathname.startsWith('/verify')
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
}

// Middleware kaha kaha run karwana h 
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ],
}