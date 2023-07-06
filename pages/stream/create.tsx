import type { NextPage } from "next";
import Button from "@/components/button";
import Input from "@/components/input";
import Layout from "@/components/layout";
import TextArea from "@/components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import { Stream } from "@prisma/client";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface Iform {
  title: string;
  price: string;
  description: string;
}

interface IStream {
  success: boolean;
  stream: Stream;
}

const Create: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<Iform>();
  const [stream, { data, loading }] = useMutation<IStream>("/api/stream");
  const onValid = (form: Iform) => {
    if (loading) return;
    if (window.confirm("정말 라이브를 켜시겠습니까?")) {
      stream(form);
    }
  };

  useEffect(() => {
    if (data && data.success) {
      router.push(`/stream/${data.stream?.id}`);
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Go Live">
      <form className=" space-y-4 px-4 py-10" onSubmit={handleSubmit(onValid)}>
        <Input
          register={register("title", { required: true })}
          required
          label="Title"
          name="title"
          type="text"
        />
        <Input
          //  valueAsNumber: 해당 value를 number값으로 바꿔준다
          register={register("price", { required: true, valueAsNumber: true })}
          required
          label="Price"
          placeholder="0.00"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", { required: true })}
          name="description"
          label="Description"
        />
        <Button text={loading ? "방송 생성중..." : "방송 시작하기"} />
      </form>
    </Layout>
  );
};

export default Create;
