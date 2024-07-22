import { NextResponse } from 'next/server'
import { apiUrl } from './utils/api'
// import { apiUrl } from '@/utils'


export async function middleware(request) {
  // console.log("-------Middleware-------")
  try {
    const auth_token = request.cookies.get('authToken')?.value
    const connectingIP = request.headers.get('CF-Connecting-IP');

    const response = await fetch(`${apiUrl}/usuarios`, {
      headers: {
        Authorization: `Bearer ${auth_token}`,
        'X-Forwarded-For': connectingIP,
        'User-Agent': `${request?.headers?.get('user-agent')} ${request.cookies.get('authToken')?.value}`
      }
    })
    console.log(response.status)
    if (response.status === 401) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (response.status === 500) {
      return NextResponse.redirect(new URL('/500', request.url))
    }
    // if (response.status === 404) {
    //   return NextResponse.redirect(new URL('/404', request.url))
    // }
    if(request.nextUrl.pathname == '/'){
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next();
    
  } catch(error) {
    // console.log(error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/',
    '/obras-status/:path*',
    '/obra-status/:path*',
    '/tags/:path*',
    '/tag/:path*',
    '/usuarios/:path*',
    '/usuario/:path*',
    '/obras/:path*',
    '/obra/:path*',
    '/obras/:path*',
    '/obra/:path*',
    '/login/:path*',
  ],
}
