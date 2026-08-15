import { NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/admin-auth'

/** Meldet ab, indem das Sitzungscookie gelöscht wird. */
export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url), {
    // 303 sorgt dafür, dass der Browser das Ziel per GET lädt.
    status: 303,
  })

  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })

  return response
}
