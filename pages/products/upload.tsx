import type { NextPage } from "next";
import Button from "@/components/button";
import Input from "@/components/input";
import Layout from "@/components/layout";
import TextArea from "@/components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Product } from "@prisma/client";
import useUser from "@/libs/client/useUser";

interface UploadProductsType {
  name: string;
  price: number;
  description: string;
  photo: FileList;
}

interface ProductMutationType {
  success: boolean;
  // prisma에서 model에 관한 type을 제공해준다.
  product: Product;
}

const Upload: NextPage = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [productImage, setProductImage] = useState("");
  const { register, handleSubmit, watch } = useForm<UploadProductsType>();
  const [uploadProduct, { data: productData, loading }] =
    useMutation<ProductMutationType>("/api/products");
  const photo = watch("photo");
  const onValid = async ({ name, price, description, photo }: UploadProductsType) => {
    if (loading) return;
    if (photo && photo.length > 0) {
      const { uploadURL } = await (await fetch("/api/files")).json();

      const form = new FormData();
      form.append("file", photo[0], String(user?.id));

      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      uploadProduct({ name, price, description, image: id });
    } else {
      uploadProduct({ name, price, description });
    }
  };

  // 상품 이미지 넣자마자 변경
  useEffect(() => {
    if (photo && photo.length > 0) {
      const image = URL.createObjectURL(photo[0]);
      setProductImage(image);
    }
  }, [photo]);

  // 상품 게시 성공시 해당 게시글의 detail페이지로 이동
  useEffect(() => {
    if (productData?.success) {
      router.push(`/products/${productData.product.id}`);
    }
  }, [productData, router]);

  return (
    <Layout canGoBack title="Upload Product">
      <form className="space-y-4 p-4" onSubmit={handleSubmit(onValid)}>
        <div>
          {productImage ? (
            <img
              src={productImage}
              className="h-46 flex w-full items-center justify-center border-gray-300 text-gray-600"
            />
          ) : (
            <label className="flex h-48 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-500">
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input {...register("photo")} className="hidden" type="file" />
            </label>
          )}
        </div>
        <Input
          register={register("name", {
            required: "이름을 작성해주세요.",
          })}
          required
          label="Name"
          name="name"
          type="text"
        />

        <Input
          register={register("price", {
            required: "가격을 작성해주세요.",
          })}
          required
          label="Price"
          placeholder="0.00"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", {
            required: "설명을 작성해주세요.",
          })}
          name="description"
          label="Description"
          required
        />
        <Button btnType="submit" text="Upload item" />
      </form>
    </Layout>
  );
};

export default Upload;
