'use server'

import { signIn } from '@@/auth'
import bcrypt from 'bcryptjs'
import db from '@/lib/db'
import { DEFAULT_REDIRECT_PATH } from '@@/routes'
import { AuthError } from 'next-auth'
import { createUser, getUserByEmail } from '@/data/user'
import { generatePasswordResetToken, generateVerificationToken, generateTwoFactorToken } from '@/lib/tokens'
import { loginSchema, newPasswordSchema, resetSchema } from '@/schemas/login'
import { sendPasswordResetEmail, sendVerificationEmail, sendTwoFactorTokenEmail } from '@/lib/mail'
import { getVerificationTokenByToken } from '@/data/verification-token'
import { z } from 'zod'
import { getPasswordResetTokenbyToken } from '@/data/passwordResetToken'
import { getTwoFactorTokenbyEmail } from '@/data/twoFactorToken'
import { getTwoFactorConfirmationbyUserId } from '@/data/twoFactorConfirmation'

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token)
  if (!existingToken) {
    return { error: 'Token does not exist' }
  }
  const hasExpired = new Date(existingToken.expires) < new Date()
  if (hasExpired) {
    return { error: 'Token has expired' }
  }
  const existingUser = await getUserByEmail(existingToken.email)
  if (!existingUser) {
    return { error: 'Email does not exist' }
  }
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  })
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  })
  return { success: 'Email verified' }
}

export const registerAction = async (values: { email: string; password: string }) => {
  const validatedFields = loginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid Fields!' }
  }

  const { email, password } = validatedFields.data

  const hashed = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) return { error: 'E-mail already in use.' }

  await createUser(email, hashed)

  const verificationToken = await generateVerificationToken(email)
  await sendVerificationEmail(verificationToken.email, verificationToken.token)
  return { success: 'Email Verification Sent!' }
}

export const signInAction = async (values: { email: string; password: string }) => {
  const validatedFields = loginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid Fields!' }
  }

  const { email, password, code } = validatedFields.data
  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'E-mail does not exist' }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)
    return { success: 'Confirmation e-mail Sent!' }
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenbyEmail(existingUser.email)

      if (!twoFactorToken) return { error: 'Invalid code!' }
      if (!twoFactorToken.token) return { error: 'Invalid code!' }

      const hasExpired = new Date(twoFactorToken.expires) < new Date()

      if (hasExpired) return { error: 'Code expired!' }

      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      })

      const existingConfirmation = await getTwoFactorConfirmationbyUserId(existingUser.id)

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        })
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      })
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)

      return { twoFactor: true }
    }
  }

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

export const reset = async (values: z.infer<typeof resetSchema>) => {
  const validatedFields = resetSchema.safeParse(values)
  if (!validatedFields.success) {
    return { error: 'Invalid Email!' }
  }
  const existingUser = await getUserByEmail(validatedFields.data.email)
  if (!existingUser) {
    return { error: 'Email not found!' }
  }
  const passwordResetToken = await generatePasswordResetToken(validatedFields.data.email)
  await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)
  return { success: 'Sent reset email' }
}

export const newPassword = async (values: z.infer<typeof newPasswordSchema>, token: string | null) => {
  if (!token) {
    return { error: 'Missing token' }
  }
  const validatedFields = newPasswordSchema.safeParse(values)
  if (!validatedFields.success) {
    return { error: 'Invalid inputs!' }
  }
  const { password } = validatedFields.data
  const existingToken = await getPasswordResetTokenbyToken(token)
  // console.log(token);
  if (!existingToken) {
    return { error: 'Invalid token' }
  }
  const hasExpired = new Date(existingToken.expires) < new Date()
  if (hasExpired) {
    return { error: 'Token has expired' }
  }
  const existingUser = await getUserByEmail(existingToken.email)
  if (!existingUser) {
    return { error: 'Email does not exist' }
  }
  const hashed = await bcrypt.hash(password, 10)
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: { password: hashed },
  })
  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  })
  return { success: 'Password was reset' }
}
