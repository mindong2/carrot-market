import type { NextPage } from "next";
import Link from "next/link";
import FloatingButton from "@/components/floating-button";
import Layout from "@/components/layout";
import useSWR from "swr";
import { Stream } from "@prisma/client";
import { useRouter } from "next/router";

export interface IStream {
  success: boolean;
  stream: Stream[];
}

const Stream: NextPage = () => {
  const router = useRouter();
  console.log(router.query);
  // pagination 구현 준비
  const { data } = useSWR<IStream>(`/api/stream?page=${router.query.page}`);

  return (
    <Layout hasTabBar title="라이브">
      <div className=" space-y-4 divide-y-[1px]">
        {data?.stream?.map((live) => (
          <Link key={live?.id} href={`/stream/${live?.id}`} className="block px-4  pt-4">
            <div className="aspect-video w-full rounded-md bg-slate-300 shadow-sm" />
            <h1 className="mt-2 text-2xl font-bold text-gray-900">{live?.title}</h1>
          </Link>
        ))}
        <FloatingButton href="/stream/create">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Stream;
