import type { NextPage, NextPageContext } from "next";
import Link from "next/link";
import Layout from "../../components/layout";
import useSWR, { SWRConfig } from "swr";
import { Review, User } from "@prisma/client";
import { cloudflareGetImage, cls } from "@/libs/client/utils";
import useUser from "@/libs/client/useUser";
import Spinner from "@/components/spinner";
import Image from "next/image";
import { withSsrSession } from "@/libs/server/withSession";
import client from "@/libs/server/client";

interface Iprofile {
  success: boolean;
  profile: User;
}

interface createdForWithReview extends Review {
  createdBy: User;
}

interface reviewWithCreateFor {
  success: boolean;
  review: createdForWithReview[];
}

const Profile: NextPage = () => {
  const { data: reviewData } = useSWR<reviewWithCreateFor>("/api/review");
  const { user } = useUser();
  return (
    <>
      {reviewData ? (
        <Layout hasTabBar title="나의 캐럿">
          <div className="px-4">
            <div className="mt-4 flex items-center space-x-3">
              {user?.avatar ? (
                <img
                  // 맨끝이 public이 아닌 avatar -> CF 페이지에서 variance 추가
                  alt=""
                  placeholder="blur"
                  src={cloudflareGetImage(user?.avatar, "avatar")}
                  className="h-16 w-16 rounded-full bg-slate-500"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-slate-500"></div>
              )}
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{user?.name}</span>
                <Link href="/profile/edit" className="text-sm text-gray-700">
                  Edit profile &rarr;
                </Link>
              </div>
            </div>
            <div className="mt-10 flex justify-around">
              <Link href="/profile/sold" className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-400 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                </div>
                <span className="mt-2 text-sm font-medium text-gray-700">판매내역</span>
              </Link>
              <Link href="/profile/bought" className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-400 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                </div>
                <span className="mt-2 text-sm font-medium text-gray-700">구매내역</span>
              </Link>
              <Link href="/profile/loved" className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-400 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    ></path>
                  </svg>
                </div>
                <span className="mt-2 text-sm font-medium text-gray-700">관심목록</span>
              </Link>
            </div>
            {reviewData?.review
              ? reviewData?.review?.map((item) => {
                  return (
                    <div className="mt-12" key={item?.id}>
                      <div className="flex items-center space-x-4">
                        {item?.createdBy?.avatar ? (
                          <img src={cloudflareGetImage(item?.createdBy?.avatar, "avatar")} alt="" className="h-12 w-12 rounded-full bg-slate-500" />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-slate-500"></div>
                        )}

                        <div>
                          <h4 className="text-sm font-bold text-gray-800">{item?.createdBy?.name}</h4>
                          <div className="flex items-center">
                            {/* 별점 */}
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                className={cls("h-5 w-5", item?.scroe >= star ? "text-yellow-400" : "text-gray-400")}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                                key={star}
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-gray-600">
                        <p>{item?.review}</p>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </Layout>
      ) : (
        <Spinner />
      )}
    </>
  );
};

const Page: NextPage<{ profile: User }> = ({ profile }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/users/me": { success: true, profile },
        },
      }}
    >
      <Profile />
    </SWRConfig>
  );
};

// 인증정보도 서버에서 받아오고 Page라는 컴포넌트로 전달 후 Profile로 전달, 초기 캐시값 지정

export const getServerSideProps = withSsrSession(async function ({ req }: NextPageContext) {
  const profile = await client.user.findUnique({
    where: { id: req?.session.user?.id },
  });
  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
    },
  };
});
// export default 하는 컴포넌트에 따라 getServerSideProps에서 요청하는 데이터가 다른곳으로 전달된다.
export default Page;
