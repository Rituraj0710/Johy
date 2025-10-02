import { NextResponse } from "next/server";

// Only enforce admin/staff via cookies; user/agent use client-side guards (localStorage)
const authPaths = ['/admin/login', '/admin'];

export async function middleware(request){
  try {
    const isAuthenticated = request.cookies.get('is_auth')?.value;
    const isRole = request.cookies.get("role")?.value;
    const path = request.nextUrl.pathname;

    // Handle admin route specifically
    if (path === '/admin' && !isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // If hitting /admin/login and already authenticated as admin or staff, route accordingly
    if (path === '/admin/login' && isAuthenticated) {
      if (isRole === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
      return NextResponse.redirect(new URL('/staff/dashboard', request.url));
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Error occured while checking authentication:',error);
    return NextResponse.error();
  }
}

export const config = {
  matcher: ['/admin/:path*']
}