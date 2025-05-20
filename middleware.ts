import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { authConfigRoutes } from './utils/routeAccess';

const SECRET_KEY = process.env.SESSION_SECRET;

export async function middleware(request: NextRequest) {
    // Get current url
    const path = request.nextUrl.pathname;
    const token = request.cookies.get('AUTH_TOKEN')?.value;
    const loginUrl = new URL('/login', request.url);
    const forbiddenUrl = new URL('/forbidden', request.url);
    const { basePath, employeeAllowedRoutes } = authConfigRoutes.adminRoutes;

    if (path.startsWith('/admin')) {
        if (!token) {
            // Redirect to login
            return NextResponse.redirect(loginUrl);
        }
        try {
            // Verify token is valid
            const secretKey = new TextEncoder().encode(SECRET_KEY);
            const { payload } = await jwtVerify(token, secretKey);
            const userRole = payload.role as string;

            if (userRole === 'Employee') {
                const isAllowed = employeeAllowedRoutes.some(
                    (allowedPath) =>
                        path.startsWith(allowedPath) || path === basePath,
                );

                if (!isAllowed) {
                    return NextResponse.redirect(forbiddenUrl);
                }
            }
            await jwtVerify(token, secretKey);
            return NextResponse.next();
        } catch (error) {
            return NextResponse.redirect(loginUrl);
        }
    }
    return NextResponse.next();
}

// matcher allows you to filter Middleware to run on specific paths.
export const config = {
    matcher: ['/admin/:path*'],
};
