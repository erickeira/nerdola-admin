import { NextResponse } from 'next/server'
// import { apiUrl } from '@/utils'


export async function middleware(request) {
  // console.log("-------Middleware-------")
  try {
    if(request.nextUrl.pathname == '/'){
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if(request.nextUrl.pathname == '/admin'){
      return NextResponse.redirect(new URL('/admin/usuarios', request.url))
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
    '/preencher-cadastro/:path*',
    '/cadastros/:path*',
    '/login/:path*',
  ],
}
