import type { NextPage } from "next";
import Item from "../../components/item";
import Layout from "../../components/layout";
import useSWR from "swr";

import { ProductWithFavCounte } from "@/pages/index";

interface IKind {
  kind: "sales" | "purchases" | "favs";
}

interface Record {
  id: number;
  product: ProductWithFavCounte;
}

interface ProductListResponse {
  [key: string]: Record[];
}

const Sold = ({ kind }: IKind) => {
  const { data } = useSWR<ProductListResponse>(`/api/user/me/purchases`);
  console.log(data);
  return (
    <Layout title="판매내역" canGoBack>
      <div className="flex flex-col space-y-5 divide-y  pb-10">
        {data?.purchases.map((record) => (
          <Item id={record.id} key={record.id} title={record.product.name} price={record.product.price} hearts={record.product._count.favorites} />
        ))}
      </div>
    </Layout>
  );
};

export default Sold;
