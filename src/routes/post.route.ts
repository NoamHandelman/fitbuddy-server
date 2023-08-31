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

router.route('/').post(validateRequest(createPostSchema), createPostController);

router.route('/').get(validateRequest(getPostsSchema), getAllPostsController);

router
  .route('/:postId/likes')
  .get(validateRequest(handleLikeSchema), handleLikeController);

router
  .route('/:userId')
  .get(validateRequest(getUserPostsSchema), getUserPostsController);

router
  .route('/:postId')
  .patch(validateRequest(editPostSchema), editPostController);

router
  .route('/:postId')
  .delete(validateRequest(deletePostSchema), deletePostController);

export default router;
