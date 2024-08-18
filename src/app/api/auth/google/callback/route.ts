import { DEFAULT_LOGIN_REDIRECT } from '@/lib/routes';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { lucia } from '@/lib/lucia';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { googleOAuthClient } from '@/lib/clients/googleOauth';

export async function GET(req: NextRequest, res: Response) {
  const url = req.nextUrl;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code || !state) {
    console.error('No code or state in query params!');
    return new Response('Invalid Request', { status: 400 });
  }

  const codeVerifier = cookies().get('codeVerifier')?.value;
  const savedState = cookies().get('state')?.value;

  if (!codeVerifier || !savedState) {
    console.error('No code verifier or state in cookies!');
    return new Response('Invalid Request', { status: 400 });
  }

  if (state !== savedState) {
    console.error('State mismatch!');
    return new Response('Invalid Request', { status: 400 });
  }

  cookies().set('codeVerifier', '', { expires: new Date(0) });
  cookies().set('state', '', { expires: new Date(0) });

  const { accessToken } = await googleOAuthClient.validateAuthorizationCode(
    code,
    codeVerifier
  );
  const googleResponse = await fetch(
    'https://www.googleapis.com/oauth2/v1/userinfo',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const googleData = (await googleResponse.json()) as {
    id: string;
    email: string;
    name: string;
    picture: string;
  };

  let userId: string = '';
  const existingUser = await prisma.user.findUnique({
    where: {
      email: googleData.email,
    },
  });
  if (existingUser) {
    userId = existingUser.id;
  } else {
    const user = await prisma.user.create({
      data: {
        name: googleData.name,
        email: googleData.email,
        avatar: googleData.picture,
        emailVerified: new Date(),
      },
    });
    userId = user.id;
  }

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect(DEFAULT_LOGIN_REDIRECT);
}
