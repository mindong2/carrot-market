/* 
    1. 페이지이동, api호출시 middleware 사용자가 페이지에 도달하기전에 실행 
    2. 모든 Response는 return을 해야 작동한다
    주로 다 완성 시킨 후 최적화작업시 사용하는것을 권장
*/

import { type NextRequest, type NextFetchEvent, userAgent, NextResponse } from "next/server";
/*
  static파일 요청들이 있기때문에 아래 코드와 같이 매칭되는 url에서만 미들웨어가 발생하도록 할 수 있다
 */
export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const ua = userAgent(req);
  if (ua.isBot) {
    return new Response("봇 접근이 감지되었습니다. 다시 시도해주세요.", {
      status: 403,
    });
  }
  if (!req.url.includes("/api")) {
    if (!req.url.includes(`${req.nextUrl.origin}/enter`) && !req.cookies.get("carrotsession")) {
      return NextResponse.redirect(`${req.nextUrl.origin}/enter`);
    }
  }
}
