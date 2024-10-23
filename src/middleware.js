import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

const secret = new TextEncoder().encode(process.env.TOKEN_SECRET_KEY);

const verifyToken = async (token) => {
  if(token === process.env.ADMIN_TOKEN) return true;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return false;
  }
};

// add protected route with method  here 
const protectedRoutes = {
  '/api/blog': ['POST', 'PUT', 'DELETE'],
  '/api/ask-ai': ['POST'], 
  '/api/gethistory': ['GET']
};

export async function middleware(req) {
  const { method, nextUrl: { pathname } } = req;
  let token = req.headers.get('Authorization');
  const matchedRoute = Object.keys(protectedRoutes).find(route => pathname.startsWith(route));

  const decodedToken = await verifyToken(token);
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
  if (decodedToken.user) {
    res.headers.set('x-profile', JSON.stringify(decodedToken.user));
  }
  return res;
}

export const config = {
  matcher: ['/:path*'],
};
