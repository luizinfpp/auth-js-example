import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
// import Nodemailer from 'next-auth/providers/nodemailer'
import authConfig from './auth.config'

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ token, session }) {
      if (session.user) session.user.customField = token.customField
      return session
    },
    async jwt({ token }) {
      token.customField = 'test'
      return token
    },
  },
  ...authConfig,
})
