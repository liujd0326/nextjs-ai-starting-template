import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // 检查是否是受保护的路由
  const protectedPaths = ['/dashboard'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    try {
      // 检查 Better Auth 的 session cookie
      // Better Auth 默认使用 'better-auth.session_token' 作为 cookie 名称
      const sessionCookie = request.cookies.get('better-auth.session_token') || 
                           request.cookies.get('better-auth.session') ||
                           request.cookies.get('session_token');
      
      if (!sessionCookie?.value) {
        // 如果没有 session cookie，重定向到登录页面
        const url = new URL('/sign-in', request.url);
        return NextResponse.redirect(url);
      }

      // 简化版本：如果有 session cookie 就通过
      // 具体的 session 验证留给页面级组件处理
      
    } catch (error) {
      // 如果认证检查出错，也重定向到登录页面
      console.error('Auth middleware error:', error);
      const url = new URL('/sign-in', request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// 配置中间件运行的路径
export const config = {
  matcher: [
    '/dashboard/:path*',
  ]
};