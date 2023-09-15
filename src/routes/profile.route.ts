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

/**
 * @openapi
 * /api/v1/profiles:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Get all user profiles
 *     security:
 *       - bearerAuth: [] # Indicate that bearerAuth security is required for this endpoint
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               profiles: [
 *                 {
 *                   _id: "6491954ae5eb10d7063b7a59",
 *                   user: {
 *                     _id: "65004dcc4711c5a81c7a8b83",
 *                     username: "exampleUser",
 *                     imageUrl: "https://d38sh0xhlkw1p8.cloudfront.net/21.jpg"
 *                   },
 *                   bio: "some details about the user",
 *                   profession: "developer",
 *                   education: "BSc in Computer Science",
 *                   residence: "Tel-Aviv",
 *                   favoriteSport: "bodybuilding",
 *                   birthDate: "2023-09-20T00:00:00.000Z"
 *                 },
 *               ]
 *       401:
 *         description: Unauthorized
 *       500:
 *          description: Internal Server Error
 */

router.route('/').get(getAllProfilesController);

/**
 * @openapi
 * /api/v1/profiles/searchProfiles:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Search for specific user profiles
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         description: The search query
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: [] # Indicate that bearerAuth security is required for this endpoint
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               profiles: [
 *                 {
 *                   _id: "6491954ae5eb10d7063b7a59",
 *                   user: {
 *                     _id: "65004dcc4711c5a81c7a8b83",
 *                     username: "exampleUser",
 *                     imageUrl: "https://d38sh0xhlkw1p8.cloudfront.net/21.jpg"
 *                   },
 *                   bio: "some details about the user",
 *                   profession: "developer",
 *                   education: "BSc in Computer Science",
 *                   residence: "Tel-Aviv",
 *                   favoriteSport: "bodybuilding",
 *                   birthDate: "2023-09-20T00:00:00.000Z"
 *                 },
 *               ]
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       500:
 *          description: Internal Server Error
 */

router
  .route('/searchProfiles')
  .get(validateRequest(searchProfilesSchema), searchProfilesController);

/**
 * @openapi
 * /api/v1/profiles:
 *   patch:
 *     tags:
 *       - Profile
 *     summary: Update user profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               detail:
 *                 type: string
 *                 description: Updated detail
 *             example:
 *               bio: "Updated bio"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

router.route('/').patch(validateRequest(profileSchema), editProfileController);

/**
 * @openapi
 * '/api/v1/profiles/{userId}':
 *  get:
 *     tags:
 *     - Profile
 *     summary: Get profile by user ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to whom the profile belongs
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            example:
 *               profile:
 *                 _id: "6491954ae5eb10d7063b7a59"
 *                 user: "65004dcc4711c5a81c7a8b83"
 *                 bio: "some details about the user"
 *                 profession: "developer"
 *                 education: "BSc in Computer Science"
 *                 residence: "Tel-Aviv"
 *                 favoriteSport: "bodybuilding"
 *                 birthDate: "2023-09-20T00:00:00.000Z"
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not Found
 *      500:
 *        description: Internal server error
 */

router
  .route('/:userId')
  .get(validateRequest(getProfileSchema), getProfileController);

/**
 * @openapi
 * /api/v1/profiles:
 *   delete:
 *     tags:
 *       - Profile
 *     summary: Delete some detail from profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               detail:
 *                 type: string
 *                 description: Name of the detail to delete
 *             example:
 *               detail: "bio"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

router
  .route('/')
  .delete(validateRequest(deleteDetailSchema), deleteDetailController);

export default router;
