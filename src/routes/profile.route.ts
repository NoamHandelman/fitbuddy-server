import express from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import {
  getProfileSchema,
  profileSchema,
  searchProfilesSchema,
  deleteDetailSchema,
} from '../schemas/profile.schema';
import {
  getAllProfilesController,
  searchProfilesController,
  editProfileController,
  getProfileController,
  deleteDetailController,
} from '../controllers/profile.controller';

const router = express.Router();

router.route('/').get(getAllProfilesController);

router
  .route('/searchProfiles')
  .get(validateRequest(searchProfilesSchema), searchProfilesController);

router.route('/').patch(validateRequest(profileSchema), editProfileController);

router
  .route('/:userId')
  .get(validateRequest(getProfileSchema), getProfileController);

router
  .route('/')
  .delete(validateRequest(deleteDetailSchema), deleteDetailController);

export default router;
