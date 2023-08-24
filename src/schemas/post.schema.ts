import { z } from 'zod';

const payload = {
  body: z.object({
    text: z.string({
      required_error: 'Post must contain text!',
    }),
  }),
};

const params = {
  params: z.object({
    postId: z.string({
      required_error: 'post ID is required',
    }),
  }),
};

export const getPostsSchema = z.object({
  query: z.object({
    page: z.string({ required_error: 'Page is required!' }).optional(),
  }),
});

export const createPostSchema = z.object({ ...payload });

export const handleLikeSchema = z.object({ ...params });

export const editPostSchema = z.object({ ...payload, ...params });

export const deletePostSchema = z.object({ ...params });

export type GetPostsInput = z.infer<typeof getPostsSchema>['query'];

export type CreatePostInput = z.infer<typeof createPostSchema>['body'];

export type HandleLikeInput = z.infer<typeof handleLikeSchema>['params'];

export type EditPostInput = z.infer<typeof editPostSchema>['params'];

export type DeletePostInput = z.infer<typeof deletePostSchema>['params'];
