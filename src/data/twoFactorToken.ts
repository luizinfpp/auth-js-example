import db from '@/lib/db'

export const getTwoFactorTokenbyToken = async (token: string) => {
  try {
    const twofactorToken = await db.twoFactorToken.findUnique({
      where: { token },
    })

    return twofactorToken
  } catch {
    return null
  }
}

export const getTwoFactorTokenbyEmail = async (email: string) => {
  try {
    const twofactorToken = await db.twoFactorToken.findFirst({
      where: { email },
    })

    return twofactorToken
  } catch {
    return null
  }
}
