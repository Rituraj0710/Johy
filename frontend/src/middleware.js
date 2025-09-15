import { NextResponse } from "next/server";

// Array of path to check against
const authPaths = ['/account/user-login', '/account/user-register','/account/agent-login','/account/agent-register'];
// const agentPaths = ['/account/agent-login', '/account/agent-register'];
export async function middleware(request){
  try {
    const isAuthenticated = request.cookies.get('is_auth')?.value;
    const isRole = request.cookies.get("role")?.value;
    const path = request.nextUrl.pathname;

    if(isAuthenticated && isRole === "user"){
      if(authPaths.includes(path)){
        return NextResponse.redirect(new URL('/user/profile', request.url));
      }
    }

    if(isAuthenticated && isRole === "agent"){
      if(authPaths.includes(path)){
        return NextResponse.redirect(new URL('/agent/agent-profile', request.url));
      }
    }

    if (!isAuthenticated && !authPaths.includes(path)) {
      return NextResponse.redirect(new URL('/account/user-login', request.url));
    }
    
    if (!isAuthenticated && !authPaths.includes(path)) {
      return NextResponse.redirect(new URL('/account/agent-login', request.url));
    }
    return NextResponse.next()
  } catch (error) {
    console.error('Error occured while checking authentication:',error);
    return NextResponse.error();
  }
}

export const config = {
  matcher: ['/user/:path*', '/agent/:path*', '/account/user-login', '/account/user-register', '/account/agent-login','/account/agent-register'],
}