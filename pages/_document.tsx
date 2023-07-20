// app과 _documnet의 차이는 app은 페이지 이동시 항상 실행, _document는 서버에서 한번만 실행
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* 
          link태그 내에 있는 google font를 빌드시 css로 최적화 시켜준다 (개발 환경에서는 확인 불가, 유저 다운로드 X) 
          다만 Next.js에서는 google폰트를 지원
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        {/* app component가 들어간다 */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
