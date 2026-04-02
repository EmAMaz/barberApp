// auth.ts
import NextAuth from "next-auth"
import authConfig from "./auth.config"
// Aquí podrías importar adaptadores de base de datos (Prisma, etc.) 
// que NO funcionan en el Edge.

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  ...authConfig,
})