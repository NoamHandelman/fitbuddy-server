import { z } from 'zod';

// /**
//  * @openapi
//  * components:
//  *  schemas:
//  *    RegisterUserInput:
//  *      type: object
//  *      required:
//  *        - username
//  *        - email
//  *        - password
//  *        - passwordConfirmation
//  *      properties:
//  *        username:
//  *          type: string
//  *          default: Jane Doe
//  *        email:
//  *          type: string
//  *          default: jane.doe@example.com
//  *        password:
//  *          type: string
//  *          default: stringPassword123
//  *        passwordConfirmation:
//  *          type: string
//  *          default: stringPassword123
//  *    RegisterUserResponse:
//  *      type: object
//  *      properties:
//  *        email:
//  *          type: string
//  *        username:
//  *          type: string
//  *        _id:
//  *          type: string
//  *        accessToken:
//  *          type: string
//  *        message:
//  *          type: string
//  */

export const registerUserSchema = z.object({
  body: z
    .object({
      username: z
        .string({
          required_error: 'Please provide username!',
        })
        .max(20, 'Username can not contain more then 20 characters!')
        .nonempty('Username can not be empty!'),
      email: z
        .string({
          required_error: 'Please provide email!',
        })
        .email('Please provide a valid email!'),
      password: z
        .string({
          required_error: 'Please provide password!',
        })
        .min(6, 'Password too short, please provide minimum 6 chars!'),
      passwordConfirmation: z.string({
        required_error: 'Password Confirmation is required!',
      }),
    })
    .refine((input) => input.password === input.passwordConfirmation, {
      message: 'Passwords are not match!',
      path: ['passwordConfirmation'],
    }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Please provide email!',
      })
      .email('Please provide a valid email!'),
    password: z.string({
      required_error: 'Please provide password!',
    }),
  }),
});

export const editUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .nonempty('Username can not be empty!')
      .max(20, 'Username can not contain more then 20 characters!')
      .optional(),
    email: z.string().email('Please provide a valid email!').optional(),
    password: z
      .string()
      .min(6, 'Password too short, please provide minimum 6 chars!')
      .optional(),
  }),
});

const params = {
  params: z.object({
    userId: z.string({
      required_error: 'post ID is required',
    }),
  }),
};

export type RegisterUserInput = Omit<
  z.infer<typeof registerUserSchema>['body'],
  'passwordConfirmation'
>;

export const getUserSchema = z.object({ ...params });

export type LoginUserInput = z.infer<typeof loginUserSchema>['body'];

export type EditUserInput = z.infer<typeof editUserSchema>['body'];

export type GetUserInput = z.infer<typeof getUserSchema>['params'];
