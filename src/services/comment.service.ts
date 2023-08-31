import { FilterQuery, UpdateQuery } from 'mongoose';
import { NotFoundError } from '../errors/NotFound';
import Comment, {
  ICommentDocument,
  ICommentInput,
} from '../models/comment.model';
import Post from '../models/post.model';
import { findPost } from './post.service';
import { validatePermissions } from '../utils/validatePermissions';

export const createComment = async (input: ICommentInput) => {
  const post = await findPost({ _id: input.post });
  if (!post) {
    throw new NotFoundError('Unable to find post!');
  }

  const comment = await Comment.create({ ...input });

  if (!comment) {
    throw new Error('Unable to add comment, please try again later!');
  }

  const returnedPost = await Post.findByIdAndUpdate(input.post, {
    $push: { comments: comment._id },
  });

  if (!returnedPost) {
    throw new Error('Unable to add comment, please try again later!');
  }

  return comment;
};

export const getComments = async (postId: string) => {
  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate({ path: 'user', select: ['username', 'imageUrl'] });

  if (!comments) {
    throw new NotFoundError('Unable to find comments!');
  }

  return comments;
};

export const editComment = async (
  commentId: string,
  update: UpdateQuery<ICommentDocument>,
  userId: string
) => {
  const comment = await findComment({ _id: commentId });

  if (!comment) {
    throw new NotFoundError('Unable to find comment!');
  }

  validatePermissions(comment.user, userId);

  const updatedComment = await Comment.findByIdAndUpdate(
    { _id: commentId },
    update,
    {
      new: true,
    }
  );

  if (!updatedComment) {
    throw new Error('Unable to edit comment, please try again later!');
  }

  return updatedComment;
};

export const deleteComment = async (commentId: string, userId: string) => {
  const comment = await findComment({ _id: commentId });

  if (!comment) {
    throw new NotFoundError('Unable to find comment!');
  }

  validatePermissions(comment.user, userId);

  const deletedComment = await Comment.deleteOne({ _id: commentId });

  if (!deletedComment) {
    throw new Error('Unable to delete comment, please try again later!');
  }

  const post = await Post.updateOne(
    { _id: comment.post },
    { $pull: { comments: comment._id } }
  );

  if (!post) {
    throw new Error('Unable to delete comment, please try again later!');
  }
};

export const findComment = async (query: FilterQuery<ICommentDocument>) => {
  return await Comment.findOne(query);
};
