import { cookies } from 'next/headers';
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from './lib/routes';

import { NextRequest, NextResponse } from 'next/server';

const checkIfUrlMatchesRoutes = (routes: string[], url: string) => {
  return routes.some(pattern => new RegExp(`^${pattern}`).test(url));
};

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const nextPath = nextUrl.pathname;
  const origin = nextUrl.origin;
  const isApiAuthRoute = checkIfUrlMatchesRoutes(apiAuthPrefix, nextPath);
  const isPublicRoute = checkIfUrlMatchesRoutes(publicRoutes, nextPath);
  const isAuthRoute = checkIfUrlMatchesRoutes(authRoutes, nextPath);

  if (isPublicRoute || isApiAuthRoute) return NextResponse.next();

  const verifyRequest = await fetch(`${origin}/api/auth/verify-session`, {
    headers: { Cookie: cookies().toString() },
  });
  const verifySession = (await verifyRequest.json()) as {
    valid: boolean;
  };
  const isSignedIn = verifySession.valid;

  if (isAuthRoute) {
    if (isSignedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isPublicRoute && !isSignedIn) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    console.log('encodedCallbackUrl', encodedCallbackUrl);
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
