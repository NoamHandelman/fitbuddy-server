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
  editUserController,
  addUserImageController,
  deleteUserImageController,
  deleteUserController,
} from '../controllers/user.controller';
import { validateUser } from '../middlewares/validateUser';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @openapi
 * '/api/v1/users/register':
 *  post:
 *     tags:
 *     - User
 *     summary: Register a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           example:
 *              username: "exampleUser"
 *              email: "user@example.com"
 *              password: "securePassword"
 *              passwordConfirmation: "securePassword"
 *     responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            example:
 *              user:
 *                username: "exampleUser"
 *                email: "user@example.com"
 *                _id: "65004757d1e7881babb1f253"
 *              accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjUwMDQ3NTdkMWU3ODgxYmFiYjFmMjUzIiwiaWF0IjoxNjk0NTE3MDgwLCJleHAiOjE2OTQ1MjA2ODB9.XF_JFAfAVljlku-_b7dcITanpX5inHUuii_1MUzDLv4"
 *              message: "Registration succeeded!"
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal server error
 */

router
  .route('/register')
  .post(validateRequest(registerUserSchema), registerUserController);

/**
 * @openapi
 * '/api/v1/users/login':
 *  post:
 *     tags:
 *     - User
 *     summary: Login to your account
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           example:
 *              email: "user@example.com"
 *              password: "securePassword"
 *     responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            example:
 *              user:
 *                _id: "65004757d1e7881babb1f253"
 *                username: "exampleUser"
 *                email: "user@example.com"
 *              accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjUwMDQ3NTdkMWU3ODgxYmFiYjFmMjUzIiwiaWF0IjoxNjk0NTE3MDgwLCJleHAiOjE2OTQ1MjA2ODB9.XF_JFAfAVljlku-_b7dcITanpX5inHUuii_1MUzDLv4"
 *              message: "Successfully logged in!"
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not Found
 *      500:
 *        description: Internal server error
 */

router
  .route('/login')
  .post(validateRequest(loginUserSchema), loginUserController);

/**
 * @openapi
 * '/api/v1/users':
 *  patch:
 *     tags:
 *     - User
 *     summary: Edit your account
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           example:
 *              username: "NewUsername"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            example:
 *              user:
 *                _id: "65004757d1e7881babb1f253"
 *                username: "NewUsername"
 *                email: "user@example.com"
 *              message: "Account successfully edited!"
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not Found
 *      500:
 *        description: Internal server error
 */

router
  .route('/')
  .patch(
    [deserializeUser, validateRequest(editUserSchema), validateUser],
    editUserController
  );

/**
 * @openapi
 * '/api/v1/users':
 *  delete:
 *     tags:
 *     - User
 *     summary: Delete your account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            example:
 *              message: "Account successfully deleted!"
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not Found
 *      500:
 *        description: Internal server error
 */

router.route('/').delete([deserializeUser, validateUser], deleteUserController);

/**
 * @openapi
 * /api/v1/users/image:
 *   post:
 *     tags:
 *       - User
 *     summary: Upload profile image
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: The image to upload for the user
 *     security:
 *       - bearerAuth: [] # Indicate that bearerAuth security is required for this endpoint
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *            example:
 *              imageUrl: "https://df8s5xflk41p4.cloudfront.net/21.jpg"
 *              message: "Profile image successfully added!"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       400:
 *         description: Bad Request
 */

router
  .route('/image')
  .post(
    [deserializeUser, validateUser, upload.single('image')],
    addUserImageController
  );

/**
 * @openapi
 * '/api/v1/users/image':
 *  delete:
 *     tags:
 *     - User
 *     summary: Delete your profile image
 *     security:
 *       - bearerAuth: []
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            example:
 *              message: "Profile image successfully deleted!"
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not Found
 *      500:
 *        description: Internal server error
 */

router
  .route('/image')
  .delete([deserializeUser, validateUser], deleteUserImageController);

/**
 * @openapi
 * '/api/v1/users/{userId}':
 *  get:
 *     tags:
 *     - User
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserResponse'
 *            example:
 *              user:
 *                _id: "65004757d1e7881babb1f253"
 *                username: "exampleUser"
 *                email: "user@example.com"
 *                imageUrl: "https://d38sh0xhlkt67g3.cloudfront.net/21.jpg"
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not Found
 *      500:
 *        description: Internal server error
 */

router
  .route('/:userId')
  .get([deserializeUser, validateRequest(getUserSchema)], getUserController);

export default router;
