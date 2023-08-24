import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/unauthorized';
import { findUser } from '../services/user.service';

export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = res.locals;

    const foundUser = await findUser({ _id: user });

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
