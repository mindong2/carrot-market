import type { NextPage } from "next";
import Button from "@/components/button";
import Layout from "@/components/layout";
import useSWR from "swr";
import { useRouter } from "next/router";
import Link from "next/link";
import { Product, User } from "@prisma/client";

interface ProductWithUser extends Product {
  user: User;
}

interface ItemTypes {
  success : boolean;
  product : ProductWithUser;
  similarItems?: Product[];
}

const ItemDetail: NextPage = () => {
  const router = useRouter();
  const { data } = useSWR<ItemTypes>(
    router.query?.id ? `/api/products/${router.query.id}` : null
  )
  console.log(data)
  // * Loading 추가하기
  return (
    <Layout canGoBack hasTabBar>
      <div className="px-4  py-4">
        <div className="mb-8">
          <div className="h-96 bg-slate-300" />
          <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-slate-300" />
            <div>
              <p className="text-sm font-medium text-gray-700">{data?.product?.user?.name}</p>
              <Link href={`/user/profile/${data?.product?.user?.id}`} className="text-xs font-medium text-gray-500">
                View profile &rarr;
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">{data?.product?.name}</h1>
            <span className="text-2xl block mt-3 text-gray-900">
              {/* toLocaleString() 천단위 콤마 */}
              <b>{data?.product?.price.toLocaleString()}</b>원
            </span>
            <p className=" my-6 text-gray-700">
              {data?.product?.description}
            </p>
            <div className="flex items-center justify-between space-x-2">
              <Button large text="Talk to seller" />
              <button className="p-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                <svg
                  className="h-6 w-6 "
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">유사한 상품</h2>
            <div className=" mt-6 grid grid-cols-2 gap-4">
              {data?.similarItems ? data?.similarItems?.map((item) => (
                <Link href={`/products/${item.id}`}>
                  <div key={item?.id}>
                    <div className="h-56 w-full mb-4 bg-slate-300" />
                    <h3 className="text-gray-700 -mb-1"><b>{item.name}</b></h3>
                    <span className="text-sm font-medium text-gray-900">{item.price.toLocaleString()}원</span>
                  </div>
                </Link>
              )) : null}
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;
