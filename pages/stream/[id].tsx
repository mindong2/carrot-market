import type { NextPage } from "next";
import Layout from "@/components/layout";
import Message from "@/components/message";
import useSWR from "swr";
import { Stream } from "@prisma/client";
import { useRouter } from "next/router";
import useUser from "@/libs/client/useUser";
import useMutation from "@/libs/client/useMutation";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";

interface Iform {
  message: string;
}

interface IMessage extends Stream {
  messages: {
    id: number;
    message: string;
    user: {
      id: number;
      avatar?: string;
    };
  }[];
}

interface IStreamPost {
  success: boolean;
  streamPost: IMessage;
}

const StreamPost: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  // 메세지 작성후 스크롤 아래로 보내기 위해 추가
  const scrollIntoBottom = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset } = useForm<Iform>();
  const { data: sendMessage, mutate } = useSWR<IStreamPost>(
    router.query.id ? `/api/stream/${router.query.id}` : null,
    { refreshInterval: 1000 }
  );
  const [postMessage, { data, loading }] = useMutation(`/api/stream/${router.query.id}/message`);
  const onValid = (form: Iform) => {
    reset();
    if (loading) return;
    // post요청 보내기 전 실시간효과를 위한 임시 데이터 생성
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          streamPost: {
            ...prev.streamPost,
            messages: [
              ...prev.streamPost.messages,
              {
                id: Date.now(),
                message: form.message,
                user: {
                  ...user,
                },
              },
            ],
          },
        } as any),
      false
    );
    postMessage(form);
  };

  useEffect(() => {
    scrollIntoBottom.current?.scrollIntoView();
  }, [sendMessage]);

  return (
    <Layout canGoBack>
      <div className="space-y-4 px-4  py-10">
        <div className="aspect-video w-full rounded-md bg-slate-300 shadow-sm" />
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">{sendMessage?.streamPost?.title}</h1>
          <span className="mt-3 block text-2xl text-gray-900">
            {sendMessage?.streamPost?.price
              ? Number(sendMessage?.streamPost?.price).toLocaleString()
              : null}
          </span>
          <p className=" my-6 text-gray-700">{sendMessage?.streamPost?.description}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="h-[50vh] space-y-4 overflow-y-auto px-4  py-10 pb-16">
            {sendMessage?.streamPost.messages.map((message) => (
              <Message
                key={message?.id}
                message={message.message}
                reversed={message?.user?.id === user?.id ? true : false}
              />
            ))}
            <div ref={scrollIntoBottom}></div>
          </div>
          <div className="fixed inset-x-0 bottom-0  bg-white py-2">
            <form onSubmit={handleSubmit(onValid)}>
              <div className="relative mx-auto flex w-full  max-w-md items-center">
                <input
                  {...register("message", { required: true })}
                  type="text"
                  className="w-full rounded-full border-gray-300 pr-12 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                />
                <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                  <button className="flex items-center rounded-full bg-orange-500 px-3 text-sm text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                    &rarr;
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StreamPost;
