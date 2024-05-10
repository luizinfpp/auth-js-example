"use server"

import { signIn } from "@@/auth"
import bcrypt from "bcrypt"
import { db } from "@/src/lib/db"

export const registerAction = async ({ email, password } : {email: string, password: string}) => {
  const hashed = await bcrypt.hash(password, 10)

  const existingUser = await db.user.findUnique({
    where: {
      email
    }
  })

  if (existingUser) return { error: "E-mail already in use." }

  await db.user.create({
    data: {
      email,
      password: hashed
    }
  })

  return { success: "User successfully created!" }

}

export const signInAction = async ({ email, password } : {email: string, password: string}) => {
  await signIn("google")
}

