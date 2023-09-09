import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../custom-errors/Unauthorized';

export const deserializeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers['authorization'] as string;

  if (!authorizationHeader) {
    throw new UnauthorizedError(
      'You are not authorized to perform this action!'
    );
  }

  const tokenParts = authorizationHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    throw new UnauthorizedError('Invalid authorization header format!');
  }

  const token = tokenParts[1];

  if (!token) {
    throw new UnauthorizedError(
      'You are not authorized to perform this action'
    );
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!accessTokenSecret) {
    throw new Error('Access token secret is not defined!');
  }

  try {
    const payload = jwt.verify(token, accessTokenSecret) as JwtPayload;

    res.locals.user = payload.user;
    next();
  } catch (error) {
    next(error);
  }
};
