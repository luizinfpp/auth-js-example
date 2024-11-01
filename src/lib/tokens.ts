import crypto from 'crypto'
import { getVerificationTokenByEmail } from '@/data/verification-token'
import { v4 as uuid } from 'uuid'
import db from './db'
import moment from 'moment'
import { getPasswordResetTokenbyEmail } from '@/data/passwordResetToken'
import { getTwoFactorTokenbyEmail } from '@/data/twoFactorToken'
// import { getPasswordResetTokenbyEmail } from '@/data/password-reset-token'
export const generateVerificationToken = async (email: string) => {
  const token = uuid()
  const expires = moment(new Date()).add(1, 'hours').toISOString()
  const existingToken = await getVerificationTokenByEmail(email)
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    })
  }
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  })
  return verificationToken
}

export const generatePasswordResetToken = async (email: string) => {
  const token = uuid()
  const expires = moment(new Date()).add(1, 'hours').toISOString()
  const existingToken = await getPasswordResetTokenbyEmail(email)
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    })
  }
  const passwordToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  })
  return passwordToken
}

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString()
  const expires = new Date(new Date().getTime() + 15 * 60 * 1000)

  const existingToken = await getTwoFactorTokenbyEmail(email)

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    })
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  })

  return twoFactorToken
}
