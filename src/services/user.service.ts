import { FilterQuery } from 'mongoose';
import User, { IUser } from '../models/user.model';
import Post from '../models/post.model';
import {
  EditUserInput,
  LoginUserInput,
  RegisterUserInput,
} from '../schemas/user.schema';
import { deleteProfile } from './profile.service';
import { updatePosts } from './post.service';
import { generateS3Url, deleteS3Image } from '../utils/s3';
import { NotFoundError } from '../custom-errors/NotFound';
import { BadRequestError } from '../custom-errors/BadRequest';
import { deleteComments } from './comment.service';

export const registerUser = async (input: RegisterUserInput) => {
  try {
    const user = await User.create(input);
    const accessToken = user.createAccessToken();
    user.password = undefined!;
    user.__v = undefined!;
    return { user, accessToken };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const loginUser = async (input: LoginUserInput) => {
  const { email, password } = input;
  const user = await findUser({ email });

  if (!user) {
    throw new NotFoundError('Unable to find user with this email!');
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw new NotFoundError('User not found, please check your details!');
  }

  const accessToken = user.createAccessToken();
  user.password = undefined!;
  user.__v = undefined!;

  return { user, accessToken };
};

export const getUser = async (userId: string) => {
  const user = await findUser({ _id: userId });
  if (!user) {
    throw new NotFoundError('Unable to find user!');
  }
  user.password = undefined!;
  user.__v = undefined!;
  return user;
};

export const editUser = async (userId: string, update: EditUserInput) => {
  let user = await findUser({ _id: userId });
  if (!user) {
    throw new NotFoundError('Unable to find this user!');
  }

  Object.entries(update).forEach(([key, value]) => {
    if (value) {
      (user as any)[key] = value;
    }
  });

  const updatedUser = await user.save();
  if (!updatedUser) {
    throw new BadRequestError('Unable to update user, try again later!');
  }

  user.password = undefined!;
  user.__v = undefined;

  return updatedUser;
};

export const addUserImage = async (
  userId: string,
  file: Express.Multer.File
) => {
  try {
    const user = await findUser({ _id: userId });

    if (!user) {
      throw new NotFoundError('Unable to find this user!');
    }

    await generateS3Url(file);

    const cloudfrontUrl = process.env.CLOUDFRONT_URL;

    if (!cloudfrontUrl) {
      throw new Error('cloudfrontUrl env is not defined!');
    }

    const imageUrl = `${cloudfrontUrl}${file.originalname}`;

    user.imageUrl = imageUrl;
    await user.save();

    return imageUrl;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteUserImage = async (userId: string) => {
  try {
    const user = await findUser({ _id: userId });

    if (!user) {
      throw new NotFoundError('Unable to find this user!');
    }

    const originalName = user.imageUrl.split('/').pop();

    if (!originalName) {
      throw new Error('Unable to extract originalname!');
    }

    await deleteS3Image(originalName);

    user.imageUrl = undefined!;
    await user.save();
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteUser = async (userId: string) => {
  const query = { user: userId };
  await updatePosts(
    { 'likes.user': userId },
    { $pull: { likes: query } },
    { multi: true }
  );

  await Post.deleteMany(query);

  await deleteComments({ user: userId });

  await deleteProfile(query);

  await User.deleteOne({ _id: userId });
};

export const findUser = async (query: FilterQuery<IUser>) => {
  return await User.findOne(query);
};
