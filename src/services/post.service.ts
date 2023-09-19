import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import Post, { IPostDocument, IPostInput } from '../models/post.model';
import { validatePermissions } from '../utils/validatePermissions';
import { findUser } from './user.service';
import { NotFoundError } from '../custom-errors/NotFound';
import { deleteComments } from './comment.service';

export const createPost = async (input: IPostInput) => {
  const post = await Post.create({ ...input });
  if (!post) {
    throw new Error('Unable to create post, please try again later!');
  }
  return post;
};

export const getAllPosts = async (page: string) => {
  const skip = (+page - 1) * 3;
  const posts = await Post.find({})
    .skip(skip)
    .limit(3)
    .sort({ createdAt: -1 })
    .populate({
      path: 'likes.user',
      select: ['username', 'imageUrl'],
    })
    .populate({
      path: 'comments',
      options: { sort: { createdAt: -1 }, limit: 2 },
      populate: {
        path: 'user',
        select: ['username', 'imageUrl'],
      },
    })
    .populate({
      path: 'user',
      select: ['username', 'imageUrl'],
    });
  if (!posts) {
    throw new Error('Unable to get all posts, please try again later!');
  }
  return posts;
};

export const getUserPosts = async (page: string, userId: string) => {
  const skip = (+page - 1) * 3;
  const posts = await Post.find({ user: userId })
    .skip(skip)
    .limit(3)
    .sort({ createdAt: -1 })
    .populate({
      path: 'likes.user',
      select: ['username', 'imageUrl'],
    })
    .populate({
      path: 'comments',
      options: { sort: { createdAt: -1 }, limit: 2 },
      populate: {
        path: 'user',
        select: ['username', 'imageUrl'],
      },
    })
    .populate({
      path: 'user',
      select: ['username', 'imageUrl'],
    });
  if (!posts) {
    throw new Error('Unable to get all posts, please try again later!');
  }
  return posts;
};

export const handleLike = async (postId: string, userId: string) => {
  const post = await findPost({ _id: postId });
  if (!post) {
    throw new NotFoundError('Unable to find post!');
  }

  const userIndex = post.likes.findIndex(
    (like) => like.user.toString() === userId
  );

  if (userIndex !== -1) {
    post.likes.splice(userIndex, 1);
  } else {
    const requiredUser = await findUser({ _id: userId });
    if (!requiredUser) {
      throw new NotFoundError('Unable to find user!');
    }
    post.likes.push({ user: requiredUser._id });
  }

  await post.save();
  return post;
};

export const editPost = async (
  postId: string,
  update: UpdateQuery<IPostDocument>,
  userId: string
) => {
  const post = await findPost({ _id: postId });
  if (!post) {
    throw new NotFoundError('Unable to find this post!');
  }

  validatePermissions(post.user, userId);

  update.updatedAt = new Date();

  const updatedPost = await Post.findOneAndUpdate({ _id: postId }, update, {
    new: true,
  });

  if (!updatedPost) {
    throw new Error('Unable do update post, try again later!');
  }

  return updatedPost;
};

export const deletePost = async (postId: string, userId: string) => {
  const post = await findPost({ _id: postId });
  if (!post) {
    throw new NotFoundError('Unable to find this post!');
  }

  validatePermissions(post.user, userId);

  await deleteComments({ post: postId });

  const deletedPost = await Post.deleteOne({ _id: postId });
  if (!deletedPost) {
    throw new Error('Unable do delete post, please try again later!');
  }
};

export const findPost = async (query: FilterQuery<IPostDocument>) => {
  return await Post.findOne(query);
};

export const updatePosts = async (
  query: FilterQuery<IPostDocument>,
  update: UpdateQuery<IPostDocument>,
  options?: QueryOptions
) => {
  const posts = await Post.find(query);
  if (!posts) {
    throw new NotFoundError('Unable to find posts!');
  }
  const updatedPosts = await Post.updateMany(query, update, options);

  if (!updatedPosts) {
    throw new Error('Unable to update posts, please try again later!');
  }
};
