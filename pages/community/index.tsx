import type { NextPage } from "next";
import Link from "next/link";
import FloatingButton from "@/components/floating-button";
import Layout from "@/components/layout";
import { Post, User } from "@prisma/client";
import useUser from "@/libs/client/useUser";
import client from "@/libs/server/client";

interface IpostResult extends Post {
  user: User;
  _count: {
    curiositys: number;
    answers: number;
  };
}

interface Ipost {
  post: IpostResult[];
}

const Community: NextPage<Ipost> = ({ post }) => {
  const { user, isLoading } = useUser();
  return (
    <Layout hasTabBar title="동네생활">
      <div className="space-y-4 divide-y-[2px]">
        {post?.map((item) => (
          <Link
            key={item?.id}
            href={`/community/${item?.id}`}
            className="flex cursor-pointer flex-col items-start pt-4"
          >
            <span className="ml-4 flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
              동네질문
            </span>
            <div className="mt-2 px-4 text-gray-700">
              <span className="font-medium text-orange-500">Q.</span> {item?.question}
            </div>
            <div className="mt-5 flex w-full items-center justify-between px-4 text-xs font-medium text-gray-500">
              <span>{item?.user?.name}</span>
              <span>{new Date(item?.createdAt).toLocaleString()}</span>
            </div>
            <div className="mt-3 flex w-full space-x-5 border-t px-4 py-2.5   text-gray-700">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>궁금해요 {item?._count?.curiositys}</span>
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
                <span>답변 {item?._count?.answers}</span>
              </span>
            </div>
          </Link>
        ))}
        <FloatingButton href="/community/write">
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
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export async function getStaticProps() {
  const posts =  await client.post.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          answers: true,
          curiositys: true,
        },
      },
    }
  });
  return {
    props: {
      post: JSON.parse(JSON.stringify(posts)),
    },
  };
}

export default Community;
