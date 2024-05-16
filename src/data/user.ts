import db from '@/lib/db'

export const createUser = async (email: string, password: string) => {
  try {
    return await db.user.create({
      data: {
        email,
        password,
      },
    })
  } catch (error) {
    return null
  }
}

export const getUserByEmail = async (email: string) => {
  try {
    return await db.user.findFirst({
      where: {
        email,
      },
    })
  } catch (error) {
    return null
  }
}

export const getUserById = async (id: string) => {
  try {
    return await db.user.findFirst({
      where: {
        id,
      },
    })
  } catch (error) {
    return null
  }
}
