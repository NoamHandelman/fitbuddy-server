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
    const comments = await getComments({ post: req.params.postId });
    res.status(200).json({ comments });
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
    const { user } = res.locals;
    const { commentId } = req.params;

    const updatedComment = await editComment(
      { _id: commentId },
      req.body,
      user
    );

    res
      .status(200)
      .json({ updatedComment, message: 'Comment successfully updated!' });
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
    const { user } = res.locals;
    const { commentId } = req.params;

    await deleteComment({ _id: commentId }, user);

    res.status(200).json({ message: 'Comment successfully deleted!' });
  } catch (error) {
    next(error);
  }
};
