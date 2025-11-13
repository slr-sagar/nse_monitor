import { SessionOptions } from 'iron-session';

export interface SessionData {
  email: string;
  isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_for_security',
  cookieName: 'nse_dashboard_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

// Authorized users
export const AUTHORIZED_USERS = [
  {
    email: 'aakashk@skyliferesearch.com',
    password: 'SLR_claudecode_test@01',
  },
  {
    email: 'sagark@skyliferesearch.com',
    password: 'SLR_claudecode_test@01',
  },
  {
    email: 'mahimg@skyliferesearch.com',
    password: 'SLR_claudecode_test@01',
  },
];

export function validateCredentials(email: string, password: string): boolean {
  return AUTHORIZED_USERS.some(
    (user) => user.email === email && user.password === password
  );
}
