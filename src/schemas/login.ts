import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
  code: z.optional(z.string()),
})

export const resetSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
})

export const newPasswordSchema = z.object({
  password: z.string().min(8, {
    message: 'Password length is at least 8 characters',
  }),
})
