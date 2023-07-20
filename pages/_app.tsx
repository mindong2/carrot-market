import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import { SWRConfig } from "swr";

// GET
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ refreshInterval: 300000, fetcher }}>
      <div className="mx-auto w-full max-w-xl">
        <Component {...pageProps} />
      </div>
      {/* 유저와 상호작용 전 미리 로드 (사용할일이 적음) 
      <Script src="test.js" strategy="beforeInteractive"></Script>
      default, 페이지 로드 후 스크립트 로드
      <Script src="test.js" strategy="afterInteractive"></Script>
      우선순위가 낮은, 다른 데이터 로드 후 불러옴
      <Script src="test.js" strategy="lazyOnload"></Script> */}

      {/* 하단과 같은식으로 외부 sdk 불러온 후 onLoad라는 기능을 통해 로드 된후 함수 실행가능  */}
      <Script src="https://developers.kakao.com/sdk/js/kakao.js" strategy="lazyOnload" />
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        onLoad={() => {
          // @ts-ignore
          window.fbAsyncInit = function () {
            // @ts-ignore
            FB.init({
              appId: "your-app-id",
              autoLogAppEvents: true,
              xfbml: true,
              version: "v13.0",
            });
          };
        }}
      />
    </SWRConfig>
  );
}

export default MyApp;
