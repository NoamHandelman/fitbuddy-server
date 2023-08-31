import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/Unauthorized';
import { findUser } from '../services/user.service';

export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const foundUser = await findUser({ _id: res.locals.user });

    if (!foundUser) {
      throw new UnauthorizedError(
        'You are not authorized to perform this action!'
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
