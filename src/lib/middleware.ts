import { auth } from '@/lib/auth'
import { createMiddleware } from '@tanstack/react-start'

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.session) {
      const url = new URL('/log-in', request.url)
      throw Response.redirect(new URL('/log-in', request.url), 302)
    }

    return next({
      context: {
        session,
      },
    })
  },
)

export function requireAdmin(role: string) {
  if (!['admin', 'superAdmin'].includes(role)) {
    throw new Response('Forbidden', { status: 403 })
  }
}

export function requireSuperAdmin(role: string) {
  if (role !== 'superAdmin') {
    throw new Response('Forbidden', { status: 403 })
  }
}
