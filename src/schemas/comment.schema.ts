import { z } from 'zod';

const payload = {
  body: z.object({
    text: z.string({
      required_error: 'Comment must contain text!',
    }),
  }),
};

const params = {
  params: z.object({
    postId: z
      .string({
        required_error: 'Post ID is required!',
      })
      .optional(),
    commentId: z
      .string({ required_error: ' Comment ID is required!' })
      .optional(),
  }),
};

export const createCommentSchema = z.object({ ...payload, ...params });

export const getCommentsSchema = z.object({ ...params });

export const editCommentSchema = z.object({ ...payload, ...params });

export const deleteCommentSchema = z.object({ ...params });

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export type GetCommentInput = z.infer<typeof deleteCommentSchema>['params'];

export type EditCommentInput = z.infer<typeof editCommentSchema>;

export type DeleteCommentInput = z.infer<typeof deleteCommentSchema>['params'];
