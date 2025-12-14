import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 定义需要保护的路径前缀
const protectedPaths = ['/api/users'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否是受保护的路径
  const isProtectedPath = protectedPaths.some(
    path => pathname.startsWith(path) && pathname !== '/api/hello'
  );

  // 对于受保护的路径，只允许特定的HTTP方法
  if (isProtectedPath) {
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    if (!allowedMethods.includes(request.method)) {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // 添加安全头
    const response = NextResponse.next();

    // 防止XSS攻击
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    // 防止referrer泄露
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // 内容安全策略
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
    );

    return response;
  }

  // 对于所有其他请求，继续处理
  const response = NextResponse.next();

  // 添加基本的安全头
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

// 配置匹配器
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了那些以特定前缀开头的：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
