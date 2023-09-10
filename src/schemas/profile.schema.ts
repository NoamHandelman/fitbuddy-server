import { z } from 'zod';

export const profileSchema = z.object({
  body: z.object({
    bio: z.string().optional(),
    profession: z.string().optional(),
    education: z.string().optional(),
    birthDate: z.string().optional(),
    residence: z.string().optional(),
    favoriteSport: z
      .enum(['aerobic', 'bodybuilding', 'powerlifting', 'crossfit', 'general'])
      .optional(),
  }),
});

const params = {
  params: z.object({
    userId: z.string({
      required_error: 'user ID is required!',
    }),
  }),
};

export const searchProfilesSchema = z.object({
  query: z.object({ q: z.string().nonempty('Search query is required!') }),
});

export const getProfileSchema = z.object({ ...params });

export const deleteDetailSchema = z.object({
  body: z.object({
    detail: z.string().nonempty('Detail is required!'),
  }),
});

export type ProfileInput = z.infer<typeof profileSchema>['body'];

export type GetProfileInput = z.infer<typeof getProfileSchema>['params'];

export type SearchProfilesInput = z.infer<typeof searchProfilesSchema>['query'];

export type DeleteDetailInput = z.infer<typeof deleteDetailSchema>['body'];
