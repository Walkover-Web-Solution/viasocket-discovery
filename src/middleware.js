import { NextResponse } from 'next/server';
import { decodeToken } from './auth';

// add protected route with method  here
const protectedRoutes = {
  '/api/blog': ['POST', 'PUT', 'DELETE'],
  '/api/ask-ai': ['POST'],
  '/api/gethistory': ['GET']
};

export async function middleware(req) {
  const { method, nextUrl: { pathname } } = req;
  const matchedRoute = Object.keys(protectedRoutes).find(route => pathname.startsWith(route));

  const token = req.headers.get('proxy_auth_token');
  const decodedToken = await decodeToken(token);
  if (matchedRoute) {
    const allowedMethods = protectedRoutes[matchedRoute];

    if (allowedMethods.includes(method)) {
      if (!token) {
        return NextResponse.json({ message: 'Unauthorized, sign in to perform this action' }, { status: 401 });
      }
      if (!decodedToken) {
        return NextResponse.json({ message: 'Unauthorized, sign in to perform this action' }, { status: 401 });
      }
    }
  }
  const res = NextResponse.next();
  if (decodedToken?.user) {
    res.headers.set('x-profile', JSON.stringify(decodedToken.user));
  }
  return res;
}

export const config = {
  matcher: ['/:path*'],
};
