import type { NextPage } from "next";
import FloatingButton from "@/components/floating-button";
import Item from "@/components/item";
import Layout from "@/components/layout";
import useUser from "@/libs/client/useUser";
import useSWR from "swr";
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
    <Layout title="홈" hasTabBar>
      <div className="flex flex-col space-y-5 divide-y">
        {data?.product?.map((item: ProductWithFavCounte) => (
          <Item
            id={item.id}
            key={item.id}
            title={item.name}
            price={item.price}
            comments={0}
            hearts={item._count.favorites}
            imgSrc={cloudflareGetImage(item.image, "list")}
          />
        ))}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Home;
