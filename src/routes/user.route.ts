import express from 'express';
import multer from 'multer';

import { validateRequest } from '../middlewares/validateRequest';
import { deserializeUser } from '../middlewares/deserializeUser';
import {
  registerUserSchema,
  loginUserSchema,
  editUserSchema,
  getUserSchema,
} from '../schemas/user.schema';

import {
  registerUserController,
  loginUserController,
  getUserController,
  logoutUserController,
  editUserController,
  addUserImageController,
  deleteUserImageController,
  deleteUserController,
} from '../controllers/user.controller';
import { validateUser } from '../middlewares/validateUser';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router
  .route('/register')
  .post(validateRequest(registerUserSchema), registerUserController);

router
  .route('/login')
  .post(validateRequest(loginUserSchema), loginUserController);

router.route('/logout').get(deserializeUser, logoutUserController);

router
  .route('/')
  .patch(
    [deserializeUser, validateRequest(editUserSchema), validateUser],
    editUserController
  );

router.route('/').delete([deserializeUser, validateUser], deleteUserController);

router
  .route('/image')
  .post(
    [deserializeUser, validateUser, upload.single('image')],
    addUserImageController
  );

router
  .route('/image')
  .delete([deserializeUser, validateUser], deleteUserImageController);

router
  .route('/:userId')
  .get([deserializeUser, validateRequest(getUserSchema)], getUserController);

export default router;
