import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

export const handleError: ErrorRequestHandler = async (err, req, res, next) => {
  console.log(err);

  let customizedError = {
    status: err.status || 500,
    message: err.message || 'Something went wrong, please try again later!',
  };

  if (err instanceof ZodError) {
    customizedError.status = 400;
    customizedError.message = err.errors[0].message;

    if (err.errors[0].code === 'invalid_enum_value') {
      customizedError.message =
        'Favorite sport must be selected from the options!';
    }
  }

  if (err.message.startsWith('MongoServerError: E11000')) {
    customizedError.status = 409;
    customizedError.message = 'Email already in used!';
  }

  if (err.message.startsWith('jwt expired')) {
    customizedError.status = 401;
    customizedError.message = 'Token expired, please log in again!';
    res.clearCookie('token');
    return res
      .status(customizedError.status)
      .send({ message: customizedError.message });
  }

  res.status(customizedError.status).send({ message: customizedError.message });
};
