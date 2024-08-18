import 'server-only';
import { Google } from 'arctic';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BASE_URL } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !BASE_URL) {
  throw new Error('Missing environment variables');
}

export const googleOAuthClient = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  `${BASE_URL}/api/auth/google/callback`
);
