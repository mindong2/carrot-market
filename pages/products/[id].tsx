import type { NextPage } from "next";
import Button from "@/components/button";
import Layout from "@/components/layout";
import useSWR from "swr";
import { useRouter } from "next/router";
import Link from "next/link";
import { Product, User } from "@prisma/client";
import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import useUser from "@/libs/client/useUser";
import Spinner from "@/components/spinner";

interface ProductWithUser extends Product {
  user: User;
}

interface ItemTypes {
  success: boolean;
  product: ProductWithUser;
  similarItems?: Product[];
  isFavorite: boolean;
}

const ItemDetail: NextPage = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  /*
   SWR에는 bound mutate, unbound mutate 함수가 존재 
   1. bound mutate -> mutate({}, boolean); 
   첫번째 인자는 SWR로 불러온 data update할 사항, boolean은 mutate 후 다시 누르면 해당api 최신의 정보를 get

   2. unbound mutate -> mutate('key값 (url)',{}, boolean);
   해당 페이지 외 이 데이터가 바뀌면서 영향이 가는 다른 페이지를 update. 해당 컴포넌트에는 바꾸려고하는 data가 없기때문
   mutate('url'); 만 적는다면 해당 api url을 refetch
   -참고-

   https://swr.vercel.app/ko/docs/mutation
   https://swr.vercel.app/docs/mutation
  */
  const { data, mutate } = useSWR<ItemTypes>(
    router.query?.id ? `/api/products/${router.query.id}` : null
  );

  const [favorite] = useMutation(`/api/products/${router.query.id}/fav`);

  const favoriteClick = () => {
    if (!data) return;
    // 데이터 update 후 다시 되돌릴때 isFavorite 외 다른 데이터들을 갱신시킬필요가 없으므로 2번째인자 false
    // obj update 방식 -> data를 기존 data내 데이터들과 isFavorite 만 not으로 변경
    // mutate({ ...data, isFavorite: !data.isFavorite }, false);
    mutate((prev) => prev && { ...prev, isFavorite: !prev.isFavorite }, false);
    favorite({});
  };

  // * Loading 추가하기
  return (
    <>
      {data ? (
        <Layout canGoBack hasTabBar>
          <div className="px-4  py-4">
            <div className="mb-8">
              <div className="h-96 bg-slate-300" />
              <div className="flex cursor-pointer items-center space-x-3 border-b border-t py-3">
                <div className="h-12 w-12 rounded-full bg-slate-300" />
                <div>
                  <p className="text-sm font-medium text-gray-700">{data?.product?.user?.name}</p>
                  <Link
                    href={`/user/profile/${data?.product?.user?.id}`}
                    className="text-xs font-medium text-gray-500"
                  >
                    View profile &rarr;
                  </Link>
                </div>
              </div>
              <div className="mt-5">
                <h1 className="text-3xl font-bold text-gray-900">{data?.product?.name}</h1>
                <span className="mt-3 block text-2xl text-gray-900">
                  {/* toLocaleString() 천단위 콤마 */}
                  <b>{data?.product?.price.toLocaleString()}</b>원
                </span>
                <p className=" my-6 text-gray-700">{data?.product?.description}</p>
                <div className="flex items-center justify-between space-x-2">
                  <Button large text="Talk to seller" />
                  <button
                    onClick={favoriteClick}
                    className={cls(
                      "flex items-center justify-center rounded-md p-3",
                      data?.isFavorite
                        ? "text-red-500 hover:bg-gray-100 hover:text-red-600"
                        : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    )}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">유사한 상품</h2>
              <div className=" mt-6 grid grid-cols-2 gap-4">
                {data?.similarItems
                  ? data?.similarItems?.map((item) => (
                      <Link href={`/products/${item.id}`} key={item?.id}>
                        <div>
                          <div className="mb-4 h-56 w-full bg-slate-300" />
                          <h3 className="-mb-1 text-gray-700">
                            <b>{item.name}</b>
                          </h3>
                          <span className="text-sm font-medium text-gray-900">
                            {item.price.toLocaleString()}원
                          </span>
                        </div>
                      </Link>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </Layout>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default ItemDetail;
