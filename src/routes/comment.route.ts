import express from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createCommentSchema,
  editCommentSchema,
  deleteCommentSchema,
  getCommentsSchema,
} from '../schemas/comment.schema';
import {
  createCommentController,
  getCommentsController,
  editCommentController,
  deleteCommentController,
} from '../controllers/comment.controller';

const router = express.Router();

/**
 * @openapi
 * /api/v1/comments/{postId}:
 *   post:
 *     tags:
 *       - Comment
 *     summary: Create a comment on a post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to comment on
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
 *                 description: Text of the new comment
 *             example:
 *               text: "new comment"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             example:
 *               comment: {
 *                 user: "647b6806ed93f6fd5bef262f",
 *                 post: "6502db9cdbde949e076e7e47",
 *                 text: "new comment",
 *                 _id: "65041df4aec46353850e3d6b",
 *                 createdAt: "2023-09-15T09:03:48.160Z",
 *                 __v: 0
 *               }
 *               message: "Comment successfully created!"
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
  .post(validateRequest(createCommentSchema), createCommentController);

/**
 * @openapi
 * /api/v1/comment/{postId}:
 *   get:
 *     tags:
 *       - Comment
 *     summary: Get all comments for a post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to retrieve comments for
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
 *               comments: [
 *                 {
 *                   _id: "65041df4aec46353850e3d6b",
 *                   user: {
 *                     _id: "647b6806ed93f6fd5bef262f",
 *                     username: "noam888",
 *                     imageUrl: "https://d38sh0xhlkw1p8.cloudfront.net/21.jpg"
 *                   },
 *                   post: "6502db9cdbde949e076e7e47",
 *                   text: "new comment",
 *                   createdAt: "2023-09-15T09:03:48.160Z",
 *                   __v: 0
 *                 }
 *               ]
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router
  .route('/:postId')
  .get(validateRequest(getCommentsSchema), getCommentsController);

/**
 * @openapi
 * /api/v1/comments/{commentId}:
 *   patch:
 *     tags:
 *       - Comment
 *     summary: Edit a comment by ID
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The ID of the comment to edit
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Updated text for the comment
 *             example:
 *               text: "new text"
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               comment: {
 *                 _id: "65041df4aec46353850e3d6b",
 *                 user: "647b6806ed93f6fd5bef262f",
 *                 post: "6502db9cdbde949e076e7e47",
 *                 text: "new text",
 *                 createdAt: "2023-09-15T09:03:48.160Z",
 *                 __v: 0
 *               }
 *               message: "Comment successfully updated!"
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
  .route('/:commentId')
  .patch(validateRequest(editCommentSchema), editCommentController);

/**
 * @openapi
 * /api/v1/comments/{commentId}:
 *   delete:
 *     tags:
 *       - Comment
 *     summary: Delete a comment by ID
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The ID of the comment to delete
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
 *               message: "Comment successfully deleted"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router
  .route('/:commentId')
  .delete(validateRequest(deleteCommentSchema), deleteCommentController);

export default router;
