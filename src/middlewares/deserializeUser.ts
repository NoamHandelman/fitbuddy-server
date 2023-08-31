import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/Unauthorized';

export const deserializeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;

  if (!token) {
    throw new UnauthorizedError(
      'You are not authorized to perform this action'
    );
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;

    res.locals.user = payload.user;
    next();
  } catch (error) {
    next(error);
  }
};
