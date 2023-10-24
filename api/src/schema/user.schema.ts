import { TypeOf, object, string } from 'zod'

export const createUserSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),

    password: string({
      required_error: 'Password is required',
    }).min(8, 'Password should be at least 8 characters minimum'),
  }),
})

export type CreateUserInput = TypeOf<typeof createUserSchema>
