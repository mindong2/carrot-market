import Item from "@/components/item";
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

const ProductList = ({ kind }: IKind) => {
  const { data } = useSWR<ProductListResponse>(`/api/user/me/${kind}`);
  console.log(data);
  return (
    <div className="flex flex-col space-y-5 divide-y  pb-10">
      {data
        ? data[kind]?.map((record) => (
            <Item
              id={record?.id}
              key={record?.id}
              title={record?.product?.name}
              price={record?.product?.price}
              hearts={record?.product?._count?.favorites}
            />
          ))
        : null}
    </div>
  );
};

export default ProductList;
