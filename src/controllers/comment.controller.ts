import { NextFunction, Request, Response } from 'express';
import {
  CreateCommentInput,
  DeleteCommentInput,
  EditCommentInput,
  GetCommentInput,
} from '../schemas/comment.schema';
import {
  createComment,
  getComments,
  editComment,
  deleteComment,
} from '../services/comment.service';

export const createCommentController = async (
  req: Request<CreateCommentInput['params'], {}, CreateCommentInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = res.locals;
    const post = req.params.postId;
    const { text } = req.body;

    const comment = await createComment({ user, post, text });

    res.status(200).json({ comment, message: 'Comment successfully created!' });
  } catch (error) {
    next(error);
  }
};

export const getCommentsController = async (
  req: Request<GetCommentInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.params.postId) {
      const comments = await getComments(req.params.postId);
      res.status(200).json({ comments });
    }
  } catch (error) {
    next(error);
  }
};

export const editCommentController = async (
  req: Request<EditCommentInput['params'], {}, EditCommentInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.params.commentId) {
      const comment = await editComment(
        req.params.commentId,
        req.body,
        res.locals.user
      );

      res
        .status(200)
        .json({ comment, message: 'Comment successfully updated!' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteCommentController = async (
  req: Request<DeleteCommentInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.params.commentId) {
      await deleteComment(req.params.commentId, res.locals.user);
      res.status(200).json({ message: 'Comment successfully deleted!' });
    }
  } catch (error) {
    next(error);
  }
};
