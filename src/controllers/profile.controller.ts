import { Request, Response, NextFunction } from 'express';
import {
  DeleteDetailInput,
  GetProfileInput,
  ProfileInput,
  SearchProfilesInput,
} from '../schemas/profile.schema';
import {
  getAllProfiles,
  searchProfiles,
  editProfile,
  getProfile,
  deleteDetail,
} from '../services/profile.service';

export const getAllProfilesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const profiles = await getAllProfiles();
    res.status(200).json({ profiles });
  } catch (error) {
    next(error);
  }
};

export const searchProfilesController = async (
  req: Request<{}, {}, {}, SearchProfilesInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const profiles = await searchProfiles(req.query.q);
    return res.status(200).json({ profiles });
  } catch (error) {
    next(error);
  }
};

export const editProfileController = async (
  req: Request<{}, {}, ProfileInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedProfile = await editProfile(res.locals.user, { ...req.body });

    res
      .status(200)
      .json({ updatedProfile, message: 'Profile successfully updated!' });
  } catch (error) {
    next(error);
  }
};

export const getProfileController = async (
  req: Request<GetProfileInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const profile = await getProfile(req.params.userId);
    res.status(200).json({ profile });
  } catch (error) {
    next(error);
  }
};

export const deleteDetailController = async (
  req: Request<{}, {}, DeleteDetailInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteDetail(res.locals.user, req.body.detail);
    res.status(200).json({ message: 'Detail successfully deleted!' });
  } catch (error) {
    next(error);
  }
};
