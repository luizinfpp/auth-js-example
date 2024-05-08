import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import Nodemailer from "next-auth/providers/nodemailer"
 
const prisma = new PrismaClient()
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  providers: [
    GoogleProvider, 
    // Nodemailer({
    //   server: {
    //     host: process.env.EMAIL_SERVER_HOST,
    //     port: process.env.EMAIL_SERVER_PORT,
    //     auth: {
    //       user: process.env.EMAIL_SERVER_USER,
    //       pass: process.env.EMAIL_SERVER_PASSWORD,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    // })
  ],
  adapter: PrismaAdapter(prisma),
})