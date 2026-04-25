// auth.config.ts
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export default {
  providers: [
    Google({
      clientId: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_AUTH_GOOGLE_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/components/auth/signin",
  }
} satisfies NextAuthConfig;
