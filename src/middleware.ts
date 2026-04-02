// middleware.ts
export { auth as middleware } from "@/auth"

export const config = {
  // Define qué rutas requieren autenticación
  matcher: ["/admin/:path*"],
}