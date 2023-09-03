import { NextFunction, Request, Response } from 'express';
import { findUser } from '../services/user.service';
import { UnauthorizedError } from '../custom-errors/Unauthorized';

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
