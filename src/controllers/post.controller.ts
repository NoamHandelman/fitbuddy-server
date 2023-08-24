import { Request, Response, NextFunction } from 'express';
import {
  CreatePostInput,
  EditPostInput,
  DeletePostInput,
  HandleLikeInput,
  GetPostsInput,
} from '../schemas/post.schema';
import {
  createPost,
  getAllPosts,
  handleLike,
  editPost,
  deletePost,
} from '../services/post.service';

export const createPostController = async (
  req: Request<{}, {}, CreatePostInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = res.locals;
    const { text } = req.body;
    const post = await createPost({ user, text });
    res.status(201).json({ post, message: 'Post successfully created!' });
  } catch (error) {
    next(error);
  }
};

export const getAllPostsController = async (
  req: Request<{}, {}, {}, GetPostsInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.query.page) {
      const posts = await getAllPosts(req.query.page);
      res.status(200).json({ posts });
    }
  } catch (error) {
    next(error);
  }
};

export const handleLikeController = async (
  req: Request<HandleLikeInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const { user } = res.locals;
    const post = await handleLike({ _id: postId }, user);
    res.status(200).json({ post });
  } catch (error) {
    next(error);
  }
};

export const editPostController = async (
  req: Request<EditPostInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const { user } = res.locals;

    const updatedPost = await editPost({ _id: postId }, req.body, user);

    res
      .status(200)
      .json({ updatedPost, message: 'Post successfully updated!' });
  } catch (error) {
    next(error);
  }
};

export const deletePostController = async (
  req: Request<DeletePostInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const { user } = res.locals;

    await deletePost({ _id: postId }, user);

    res.status(200).json({ message: 'Post successfully deleted!' });
  } catch (error) {
    next(error);
  }
};
