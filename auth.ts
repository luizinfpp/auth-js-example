import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
// import Nodemailer from 'next-auth/providers/nodemailer'
import authConfig from './auth.config'
import { getUserById } from '@/data/user'
import db from '@/lib/db'

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') {
        return true
      }
      if (!user || !user?.id) return false
      const existingUser = await getUserById(user?.id)
      if (!existingUser?.emailVerified) return false
      return true
    },
    async session({ token, session }) {
      if (token.sub && session.user) session.user.id = token.sub

      if (token.role && session.user) session.user.role = token.role as string

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      token.role = existingUser.role

      return token
    },
  },
  ...authConfig,
})
