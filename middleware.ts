import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.cookies.has('x-app-request')) {
    const response = NextResponse.next()
    response.cookies.delete('x-app-request')
    return response
  }

  return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
  matcher: ['/((?!_next|api|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).+)'],
}
