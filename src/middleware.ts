import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const PROTECTED_PATHS = [
  '/team-health',
  '/cic-history',
  '/lessons',
  '/time-horizon',
  '/drift-map',
  '/release-gates',
  '/incidents',
  '/sandbox',
  '/fleet',
];

let warnedMissingSecret = false;

function getJwtSecret(): Uint8Array {
  const secret = process.env.DASHBOARD_JWT_SECRET;
  if (!secret) {
    if (!warnedMissingSecret) {
      console.warn(
        '[SECURITY] DASHBOARD_JWT_SECRET is not set. All invite tokens will fail verification. ' +
          'Set this env var before deploying to production.',
      );
      warnedMissingSecret = true;
    }
    // Use a random per-boot secret so that any user-provided token is
    // guaranteed to fail verification (instead of silently accepting a
    // predictable '__missing__' fallback).
    return new TextEncoder().encode(
      `__missing_secret_${Math.random().toString(36).slice(2)}__`,
    );
  }
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get('invite_token')?.value;

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('error', 'session_expired');
    return NextResponse.redirect(url);
  }

  try {
    await jwtVerify(token, getJwtSecret(), { algorithms: ['HS256'] });
    return NextResponse.next();
  } catch {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('error', 'session_expired');
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    '/team-health/:path*',
    '/cic-history/:path*',
    '/lessons/:path*',
    '/time-horizon/:path*',
    '/drift-map/:path*',
    '/release-gates/:path*',
    '/incidents/:path*',
    '/sandbox/:path*',
    '/fleet/:path*',
  ],
};
