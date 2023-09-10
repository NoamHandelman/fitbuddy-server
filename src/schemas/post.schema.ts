import { z } from 'zod';

const payload = {
  body: z.object({
    text: z.string({
      required_error: 'Post must contain text!',
    }),
  }),
};

const postIdParams = {
  params: z.object({
    postId: z.string({
      required_error: 'Post ID is required',
    }),
  }),
};

export const getPostsSchema = z.object({
  query: z.object({
    page: z.string({ required_error: 'Page is required!' }).optional(),
  }),
});

export const getUserPostsSchema = z.object({
  params: z.object({
    userId: z.string({
      required_error: 'User ID is required',
    }),
  }),
  query: z.object({
    page: z.string({ required_error: 'Page number is required!' }).optional(),
  }),
});

export const createPostSchema = z.object({ ...payload });

export const handleLikeSchema = z.object({ ...postIdParams });

export const editPostSchema = z.object({ ...payload, ...postIdParams });

export const deletePostSchema = z.object({ ...postIdParams });

export type GetPostsInput = z.infer<typeof getPostsSchema>['query'];

export type CreatePostInput = z.infer<typeof createPostSchema>['body'];

export type HandleLikeInput = z.infer<typeof handleLikeSchema>['params'];

export type EditPostInput = z.infer<typeof editPostSchema>['params'];

export type DeletePostInput = z.infer<typeof deletePostSchema>['params'];

export type GetUserPostsInput = z.infer<typeof getUserPostsSchema>;
