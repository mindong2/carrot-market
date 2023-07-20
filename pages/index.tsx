import type { NextPage } from "next";
import FloatingButton from "@/components/floating-button";
import Item from "@/components/item";
import Layout from "@/components/layout";
import useUser from "@/libs/client/useUser";
import useSWR, { SWRConfig } from "swr";
import { Product } from "@prisma/client";
import { cloudflareGetImage } from "@/libs/client/utils";

export interface ProductWithFavCounte extends Product {
  _count: {
    favorites: number;
    [key: string]: number;
  };
}

interface ProductGetData {
  success: boolean;
  product: ProductWithFavCounte[];
}

const Home: NextPage = () => {
  const { user, isLoading } = useUser();
  const { data } = useSWR<ProductGetData>("/api/products");
  return (
    <Layout title="홈" seoTitle="홈" hasTabBar>
      <div className="flex flex-col space-y-5 divide-y">
        {data?.product?.map((item: ProductWithFavCounte) => (
          <Item
            id={item.id}
            key={item.id}
            title={item.name}
            price={item.price}
            comments={0}
            hearts={item._count?.favorites || 0}
            imgSrc={cloudflareGetImage(item.image, "list")}
          />
        ))}
        <FloatingButton href="/products/upload">
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

/* 
  Page에서 데이터를 받고, SWRConfig의 fallback으로 캐시 초기값을 지정해준다 (Home에서는 초기 캐시값인 데이터를 확인가능 -> 로딩화면 X)
  정리하자면 서버에서 먼저 데이터를 받고 클라이언트에서 캐시를 업데이트 해준다.
*/

const Page: NextPage<{ product: ProductWithFavCounte[] }> = ({ product }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/products": {
            success: true,
            product,
          },
        },
      }}
    >
      <Home />
    </SWRConfig>
  );
};

// export async function getServerSideProps() {
//   // 기존 api에서 products에 대한 데이터를 불러오므로 서버에서 불러와도 된다 (로딩이 없지만 오류가 나면 빈 화면밖에 보지 못한다.)
//   // 완전히 서버단에서 불러오는방식 -> 이미 html이 만들어져 있으므로 SEO에 용이 참고: POST할때 api에서 핸들러를 만드는방식 다만 getServerSideProps를 사용하면 cache사용이 안된다
//   const product = await client.product.findMany({});
//   return {
//     props: {
//       // nextjs는 prisma의 데이터를 읽지 못하므로 json화 시킨 후 푼다
//       product: JSON.parse(JSON.stringify(product)),
//     },
//   };
// }

export default Page;
