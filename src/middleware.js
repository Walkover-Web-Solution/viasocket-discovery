import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

const secret = new TextEncoder().encode(process.env.TOKEN_SECRET_KEY);

const verifyToken = async (token) => {
  if(token == 'verysecuredauthtoken') return true;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return false;
  }
};

export async function middleware(req) {
  const { method } = req;
  const { pathname } = req.nextUrl;
  let token = req.headers.get('Authorization');
  const decodedToken = await verifyToken(token);

  if (pathname.startsWith('/api/blog') && (method === 'POST' || method === 'PATCH')) {
    if (!token || !decodedToken) {
      return NextResponse.json({ message: 'Unauthorized, sign in to perform this action' }, { status: 401 });
    }
  }
  const res = NextResponse.next();
  if (decodedToken) {
    res.headers.set('x-profile', JSON.stringify(decodedToken.user));
  }
  return res;
}


export const config = {
  matcher: ['/api/blog/:path*'],
};
