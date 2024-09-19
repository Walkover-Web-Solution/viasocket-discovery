import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

const secret = new TextEncoder().encode(process.env.TOKEN_SECRET_KEY);

const verifyToken = async (token) => {
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

  if (pathname.startsWith('/api/blog') && (method === 'POST' || method === 'PATCH')) {
    let token = req.headers.get('Authorization');
    const decodedToken = await verifyToken(token);
    if (!token || !decodedToken) {
      return NextResponse.json({ message: 'Unauthorized, sign in to perform this action' }, { status: 401 });
    }

    req.profile = decodedToken?.user;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/blog/:path*'],
};
