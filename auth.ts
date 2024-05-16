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
      if (token.sub && session.user) session.user.id = token.sub
      return session
    },
    async jwt({ token }) {
      return token
    },
  },
  ...authConfig,
})
