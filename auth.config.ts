import GoogleProvider from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"
 
export default { providers: [GoogleProvider] } satisfies NextAuthConfig