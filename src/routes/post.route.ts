import express from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createPostSchema,
  handleLikeSchema,
  editPostSchema,
  deletePostSchema,
  getPostsSchema,
  getUserPostsSchema,
} from '../schemas/post.schema';
import {
  createPostController,
  getAllPostsController,
  handleLikeController,
  editPostController,
  deletePostController,
  getUserPostsController,
} from '../controllers/post.controller';

const router = express.Router();

/**
 * @openapi
 * /api/v1/posts:
 *   post:
 *     tags:
 *       - Post
 *     summary: Create a new post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text content of the post
 *             example:
 *               text: "new post text"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             example:
 *               post:
 *                 user: "65004757d1e7881babb1f253"
 *                 text: "new post text"
 *                 comments: []
 *                 _id: "6502db9cdbde949e076e7e47"
 *                 likes: []
 *                 createdAt: "2023-09-14T10:08:28.720Z"
 *                 __v: 0
 *               message: "Post successfully created!"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

router.route('/').post(validateRequest(createPostSchema), createPostController);

/**
 * @openapi
 * /api/v1/posts:
 *   get:
 *     tags:
 *       - Post
 *     summary: Get all posts with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The page number for pagination (default is 1)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               posts: [
 *                 {
 *                   _id: "64f0b0af28f121e810c9e490",
 *                   user: {
 *                     _id: "647b6806ed93f6fd5bef262f",
 *                     username: "noam88",
 *                     imageUrl: "https://d38sh0xhlkw1p8.cloudfront.net/21.jpg"
 *                   },
 *                   text: "Nopa6y",
 *                   comments: [],
 *                   likes: [],
 *                   createdAt: "2023-08-31T15:24:31.705Z",
 *                   __v: 0
 *                 },
 *                 {
 *                   _id: "64f0afe828f121e810c9e43f",
 *                   user: {
 *                     _id: "6494b1a3b22f7661ef047467",
 *                     username: "Noam66",
 *                     imageUrl: "https://d38sh0xhlkw1p8.cloudfront.net/21.jpg"
 *                   },
 *                   text: "test 25989",
 *                   comments: [],
 *                   likes: [],
 *                   createdAt: "2023-08-31T15:21:12.312Z",
 *                   __v: 0
 *                 }
 *               ]
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

router.route('/').get(validateRequest(getPostsSchema), getAllPostsController);

/**
 * @openapi
 * /api/v1/posts/{postId}/likes:
 *   get:
 *     tags:
 *       - Post
 *     summary: Like or dislike  for a post by ID
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to handle likes for
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               post:
 *                 _id: "6502db9cdbde949e076e7e47"
 *                 user: "647b6806ed93f6fd5bef262f"
 *                 text: "test for swagger"
 *                 comments: []
 *                 likes:
 *                   - user: "647b6806ed93f6fd5bef262f"
 *                     _id: "65041a5b0947208e263135bd"
 *                 createdAt: "2023-09-14T10:08:28.720Z"
 *                 __v: 1
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router
  .route('/:postId/likes')
  .get(validateRequest(handleLikeSchema), handleLikeController);

/**
 * @openapi
 * /api/v1/posts/{userId}:
 *   get:
 *     tags:
 *       - Post
 *     summary: Get posts by user ID with pagination
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to retrieve posts for
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The page number for pagination (default is 1)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               posts: [
 *                 {
 *                   _id: "64f0b0af28f121e810c9e490",
 *                   user: {
 *                     _id: "647b6806ed93f6fd5bef262f",
 *                     username: "noam88",
 *                     imageUrl: "https://d38sh0xhlkw1p8.cloudfront.net/21.jpg"
 *                   },
 *                   text: "post text",
 *                   comments: [],
 *                   likes: [],
 *                   createdAt: "2023-08-31T15:24:31.705Z",
 *                   __v: 0
 *                 },
 *               ]
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

router
  .route('/:userId')
  .get(validateRequest(getUserPostsSchema), getUserPostsController);

/**
 * @openapi
 * /api/v1/posts/{postId}:
 *   patch:
 *     tags:
 *       - Post
 *     summary: Edit a post by ID
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to edit
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Updated text for the post
 *             example:
 *               text: "new text"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               updatedPost: {
 *                 _id: "6502db9cdbde949e076e7e47",
 *                 user: "647b6806ed93f6fd5bef262f",
 *                 text: "new text",
 *                 comments: [],
 *                 likes: [
 *                   {
 *                     user: "647b6806ed93f6fd5bef262f",
 *                     _id: "65041a5b0947208e263135bd"
 *                   }
 *                 ],
 *                 createdAt: "2023-09-14T10:08:28.720Z",
 *                 __v: 1,
 *                 updatedAt: "2023-09-15T08:59:18.281Z"
 *               }
 *               message: "Post successfully edited!"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router
  .route('/:postId')
  .patch(validateRequest(editPostSchema), editPostController);

/**
 * @openapi
 * /api/v1/posts/{postId}:
 *   delete:
 *     tags:
 *       - Post
 *     summary: Delete a post by ID
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               message: "Post successfully deleted!"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router
  .route('/:postId')
  .delete(validateRequest(deletePostSchema), deletePostController);

export default router;
