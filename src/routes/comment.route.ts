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

router
  .route('/:postId')
  .post(validateRequest(createCommentSchema), createCommentController);

router
  .route('/:postId')
  .get(validateRequest(getCommentsSchema), getCommentsController);

router
  .route('/:commentId')
  .patch(validateRequest(editCommentSchema), editCommentController);

router
  .route('/:commentId')
  .delete(validateRequest(deleteCommentSchema), deleteCommentController);

export default router;
