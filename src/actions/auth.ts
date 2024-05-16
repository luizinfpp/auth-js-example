'use server'

import { signIn } from '@@/auth'
import bcrypt from 'bcryptjs'
import { DEFAULT_REDIRECT_PATH } from '@@/routes'
import { AuthError } from 'next-auth'
import { createUser, getUserByEmail } from '@/data/user'

export const registerAction = async ({ email, password }: { email: string; password: string }) => {
  const hashed = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) return { error: 'E-mail already in use.' }

  await createUser(email, hashed)

  return { success: 'User successfully created!' }
}

export const signInAction = async ({ email, password }: { email: string; password: string }) => {
  try {
    await signIn('credentials', { email, password, redirectTo: DEFAULT_REDIRECT_PATH })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!' }
        default:
          return { error: 'Something went wrong!' }
      }
    }

    throw error
  }

  // await signIn('google')
}
