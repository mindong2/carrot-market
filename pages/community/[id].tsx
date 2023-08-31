import type { NextPage } from "next";
import Layout from "@/components/layout";
import TextArea from "@/components/textarea";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Answer, Post, User } from "@prisma/client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import { cloudflareGetImage, cls } from "@/libs/client/utils";
import { useEffect } from "react";
import useUser from "@/libs/client/useUser";
import Spinner from "@/components/spinner";

interface Ianswer extends Answer {
  user: User;
}

interface IwriterData extends Post {
  user: User;
  _count: {
    answers: number;
    curiositys: number;
  };
  answers: Ianswer[];
}

interface IwriterResult {
  success: boolean;
  post: IwriterData;
  isCurious: boolean;
}

interface description {
  [key: string]: string;
}

const CommunityPostDetail: NextPage = () => {
  const { register, handleSubmit, reset } = useForm();
  const { user, isLoading } = useUser();

  const router = useRouter();
  // 답변 작성
  const [answer, { data: answerData, loading: answerDataLoading }] = useMutation(
    `/api/post/${router.query.id}/answer`
  );
  // 궁금해요 클릭
  const [curiosity] = useMutation(`/api/post/${router.query.id}/curiositys`);
  const {
    data: writerData,
    error,
    mutate,
  } = useSWR<IwriterResult>(router.query?.id ? `/api/post/${router.query.id}` : null);

  const onValid = (data: description) => {
    if (answerDataLoading) return;
    if (window.confirm("정말로 작성하시겠습니까?")) {
      answer(data);
    }
  };

  useEffect(() => {
    if (answerData && answerData.success) {
      reset();
      mutate();
    }
  }, [answerData, router]);

  const clickCurious = () => {
    if (!writerData) return;
    curiosity({});
    mutate(
      {
        ...writerData,
        post: {
          ...writerData.post,
          _count: {
            ...writerData?.post?._count,
            curiositys: writerData.isCurious
              ? writerData?.post._count.curiositys - 1
              : writerData?.post._count.curiositys + 1,
          },
        },
        isCurious: !writerData?.isCurious,
      },
      false
    );
  };

  console.log(writerData?.post);
  return (
    <Layout canGoBack>
      {writerData ? (
        <div>
          <span className="my-3 ml-4 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            동네질문
          </span>
          <div className="mb-3 flex cursor-pointer items-center space-x-3  border-b px-4 pb-3">
            {writerData?.post?.user?.avatar ?
              <img src={cloudflareGetImage(writerData?.post?.user?.avatar, "avatar")} alt="" className="h-12 w-12 rounded-full bg-slate-500" /> : 
              <div className="h-10 w-10 rounded-full bg-slate-300" /> 
            }
            <div>
              <Link href={`/profile/${writerData?.post?.user?.id}`}>
                <p className="text-sm font-medium text-gray-700">{writerData?.post?.user?.name}</p>
                <p className="text-xs font-medium text-gray-500">View profile &rarr;</p>
              </Link>
            </div>
          </div>
          <div>
            <div className="mt-2 px-4 text-gray-700">
              <span className="font-medium text-orange-500">Q.</span> {writerData?.post?.question}
            </div>
            <div className="mt-3 flex w-full space-x-5 border-b-[2px] border-t px-4 py-2.5  text-gray-700">
              <span className="flex items-center space-x-2 text-sm">
                <button
                  className={cls(
                    "flex items-center space-x-1",
                    writerData.isCurious ? "text-green-400" : ""
                  )}
                  onClick={clickCurious}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>궁금해요 {writerData.post?._count.curiositys}</span>
                </button>
              </span>
              <span className="flex items-center space-x-2 text-sm">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  ></path>
                </svg>
                <span>답변 {writerData?.post?._count?.answers}</span>
              </span>
            </div>
          </div>
          {writerData?.post?.answers.map((answer) => {
            return (
              <div className="my-5 space-y-5 px-4" key={answer.id}>
                <div className="flex items-start space-x-3">
                  {answer?.user?.avatar ? 
                    <img src={cloudflareGetImage(answer?.user?.avatar, "avatar")} alt="" className="h-8 w-8 rounded-full bg-slate-500" /> : 
                    <div className="h-8 w-8 rounded-full bg-slate-300" />
                  }
                  <div>
                    <span className="block text-sm font-medium text-gray-700">
                      {answer?.user?.name}
                    </span>
                    <span className="block text-xs text-gray-500 ">
                      {new Date(answer?.createdAt).toLocaleString()}
                    </span>
                    <p className="mt-2 text-gray-700">{answer?.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="px-4">
            <form onSubmit={handleSubmit(onValid)}>
              <TextArea
                register={register("description")}
                name="description"
                placeholder="Answer this question!"
                required
              />
              <button className="mt-2 w-full rounded-md border border-transparent bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ">
                Reply
              </button>
            </form>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </Layout>
  );
};

export default CommunityPostDetail;
