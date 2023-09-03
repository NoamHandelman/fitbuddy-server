import { CookieOptions, Response } from 'express';

export const attachCookie = (res: Response, token: string) => {
  const cookiesOptions: CookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    secure: process.env.NODE_ENV === 'production',
  };

  if (process.env.NODE_ENV === 'production') {
    cookiesOptions.sameSite = 'none';
    cookiesOptions.domain = '.fitbuddy-client.vercel.app';
    cookiesOptions.path = '/';
  }

  res.cookie('token', token, cookiesOptions);
};
