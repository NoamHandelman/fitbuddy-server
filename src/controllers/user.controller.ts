import { Request, Response, NextFunction } from 'express';
import {
  EditUserInput,
  GetUserInput,
  LoginUserInput,
  RegisterUserInput,
} from '../schemas/user.schema';
import {
  loginUser,
  registerUser,
  getUser,
  editUser,
  addUserImage,
  deleteUserImage,
  deleteUser,
} from '../services/user.service';
import { createProfile } from '../services/profile.service';

export const registerUserController = async (
  req: Request<{}, {}, RegisterUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, accessToken } = await registerUser(req.body);
    await createProfile(user._id.toString());
    res
      .status(201)
      .json({ user, accessToken, message: 'Registration succeeded!' });
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, accessToken } = await loginUser(req.body);
    return res
      .status(200)
      .json({ user, accessToken, message: 'Successfully logged in!' });
  } catch (error) {
    next(error);
  }
};

export const getUserController = async (
  req: Request<GetUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getUser(req.params.userId);
    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const editUserController = async (
  req: Request<{}, {}, EditUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedUser = await editUser(res.locals.user, req.body);
    res
      .status(200)
      .json({ user: updatedUser, message: `Account successfully edited!` });
  } catch (error) {
    next(error);
  }
};

export const addUserImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.file) {
      const imageUrl = await addUserImage(res.locals.user, req.file);

      res
        .status(200)
        .json({ imageUrl, message: 'Profile image successfully added!' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUserImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteUserImage(res.locals.user);
    res.status(200).json({ message: 'Profile image successfully deleted!' });
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteUser(res.locals.user);
    return res.status(200).json({ message: 'Account successfully deleted!' });
  } catch (error) {
    next(error);
  }
};
