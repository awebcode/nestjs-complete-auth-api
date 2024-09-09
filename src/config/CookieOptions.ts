import type { CookieOptions as ExpressCookieOptions } from 'express';
import { ENV } from './Env';

enum SAME_SITE {
  LAX = 'lax',
  STRICT = 'strict',
  NONE = 'none',
}

const baseCookieOptions: ExpressCookieOptions = {
  httpOnly: true,
  secure: ENV.nodeEnv === 'production',
  sameSite: SAME_SITE.STRICT,
  path: '/',
  signed: true,
};

export const getCookieOptions = (maxAge: number): ExpressCookieOptions => ({
  ...baseCookieOptions,
  maxAge: maxAge * 1000, // Convert seconds to milliseconds
  expires: new Date(Date.now() + maxAge * 1000), // Optional, but useful for clarity
});
