import type { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';
import { sessionOptions, validateCredentials, SessionData } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Validate credentials
  if (!validateCredentials(email, password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Create session
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  session.email = email;
  session.isLoggedIn = true;
  await session.save();

  return res.status(200).json({ success: true, email });
}
