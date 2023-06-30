// 유저 데이터 불러오는 hook
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

export default function useUser() {
  // const { data, error } = useSWR('/api/user/me', fetcher)
  const { data, error } = useSWR("/api/user/me");
  const router = useRouter();
  /* 
        로그인이 안된 상태라면 로그인창으로 이동 (prev history를 남기고싶지않을때 replace)
        해당 페이지 자체를 다른페이지로 대체
    */
  useEffect(() => {
    if (!data) return;
    if (data && !data.success) {
      router.push("/enter");
    }
  }, [data, router]);

  return { user: data?.profile, isLoading: !data && !error };
}

/* 
    SWR은 먼저 캐시로부터 데이터를 반환한 후, fetch 요청(재검증)을 하고, 최종적으로 최신화된 데이터를 가져오는 전략입니다. SWR을 사용하면 컴포넌트는 지속적이며 자동으로 데이터 업데이트 스트림을 받게 됩니다. 그리고 UI는 항상 빠르고 반응적입니다.
    SWR은 페이지전환시 캐시 업데이트뿐 아니라 다른 탭에서 다시 돌아올때도 업데이트를합니다.

    npm i swr 또는
    npm i swr --legacy-peer-deps
    https://swr.vercel.app/ko/docs/getting-started

    useSWR사용하기
    1. JSON 데이터를 사용하는 일반적인 RESTful API라면 먼저 네이티브 fetch의 단순한 래퍼인 fetcher 함수를 생성해야 합니다.
    ex) const fetcher = (...args) => fetch(...args).then(res => res.json())

    2. 그 다음, useSWR을 import하고, 함수 컴포넌트 내에서 사용하여 시작하면 됩니다.
    ex) const { data, error } = useSWR('/api/user/123', fetcher)

    + 일반적으로, 세 가지 요청 상태가 가능합니다: "loading", "ready", "error". data와 error 값을 사용해 현재 요청의 상태를 알아내고, 해당하는 UI를 반환할 수 있습니다.
*/
