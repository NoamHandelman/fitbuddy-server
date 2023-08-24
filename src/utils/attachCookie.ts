import { Response } from 'express';

export const attachCookie = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    secure: process.env.NODE_ENV === 'production',
  });
};
