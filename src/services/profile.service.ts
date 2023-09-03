import { FilterQuery, UpdateQuery } from 'mongoose';
import Profile, { IProfileDocument } from '../models/profile.model';
import { findUser } from './user.service';
import { DeleteDetailInput } from '../schemas/profile.schema';
import User from '../models/user.model';
import { NotFoundError } from '../custom-errors/NotFound';

export const getAllProfiles = async () => {
  const profiles = await Profile.find({}).populate({
    path: 'user',
    select: ['username', 'imageUrl'],
  });
  if (!profiles) {
    throw new NotFoundError('No profiles found!');
  }
  return profiles;
};

export const searchProfiles = async (query: string) => {
  const customQuery = new RegExp(query, 'i');

  const profiles = await User.aggregate([
    {
      $match: {
        username: {
          $regex: customQuery,
        },
      },
    },
    {
      $lookup: {
        from: 'profiles',
        localField: '_id',
        foreignField: 'user',
        as: 'profile',
      },
    },
    {
      $project: {
        'profile._id': 1,
        'profile.user': {
          _id: '$_id',
          username: '$username',
          imageUrl: '$imageUrl',
        },
        'profile.bio': 1,
        'profile.profession': 1,
        'profile.education': 1,
        'profile.birthDate': 1,
        'profile.residence': 1,
        'profile.favoriteSport': 1,
        _id: 0,
      },
    },
    {
      $unwind: '$profile',
    },
    {
      $replaceRoot: { newRoot: '$profile' },
    },
  ]).exec();

  if (!profiles) {
    throw new NotFoundError('No profiles found!');
  }
  return profiles;
};

export const createProfile = async (userId: string) => {
  const profile = await Profile.create({
    user: userId,
  });
  if (!profile) {
    throw new Error('Unable to create profile, please try again later!');
  }
};

export const editProfile = async (
  userId: string,
  update: UpdateQuery<IProfileDocument>
) => {
  const profile = await findProfile({ user: userId });
  if (!profile) {
    throw new NotFoundError('Can not find profile belong to this user!');
  }

  if (update.birthDate) {
    update.birthDate = new Date(update.birthDate);
  }

  const updatedProfile = await findProfileAndUpdate({ user: userId }, update);

  if (!updatedProfile) {
    throw new Error('Unable to update profile, please try again later!');
  }
  return updatedProfile;
};

export const deleteProfile = async (query: FilterQuery<IProfileDocument>) => {
  const profile = await findProfile(query);
  if (!profile) {
    throw new NotFoundError('Can not find profile belong to this user!');
  }

  const deletedProfile = await Profile.deleteOne(query);
  if (!deletedProfile) {
    throw new Error('Unable do delete profile, please try again later!');
  }
};

export const getProfile = async (userId: string) => {
  const user = await findUser({ _id: userId });
  if (!user) {
    throw new NotFoundError('User with this id was not found!');
  }

  const profile = await findProfile({ user: userId });
  if (!profile) {
    throw new NotFoundError('Can not find profile belong to this user!');
  }

  const returnedProfile = {
    ...profile.toObject(),
    birthDate: profile.birthDate?.toISOString(),
  };

  return returnedProfile;
};

export const deleteDetail = async (
  userId: string,
  detail: DeleteDetailInput['detail']
) => {
  const profile = await findProfile({ user: userId });
  if (!profile) {
    throw new NotFoundError('Can not find profile belong to this user!');
  }

  if (profile[detail as keyof IProfileDocument] !== undefined) {
    const updateObject = { $unset: { [detail]: '' } };
    await findProfileAndUpdate(profile._id, updateObject);
  } else {
    throw new NotFoundError('Detail not found!');
  }

  await profile.save();
};

export const findProfile = async (query: FilterQuery<IProfileDocument>) => {
  return await Profile.findOne(query);
};

const findProfileAndUpdate = async (
  query: FilterQuery<IProfileDocument>,
  update: UpdateQuery<IProfileDocument>
) => {
  return await Profile.findOneAndUpdate(query, update, { new: true });
};
