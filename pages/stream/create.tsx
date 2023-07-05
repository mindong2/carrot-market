import type { NextPage } from "next";
import Button from "@/components/button";
import Input from "@/components/input";
import Layout from "@/components/layout";
import TextArea from "@/components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import { Stream } from "stream";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface Iform {
  title: string;
  price: string;
  description: string;
}

interface IStream {
  success: boolean;
  stream: Stream[];
}

const Create: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<Iform>();
  const [stream, { loading, data }] = useMutation<IStream>("/api/stream");
  const onValid = (form: Iform) => {
    if (loading) return;
    console.log(form);
  };

  useEffect(() => {
    if (data && data.success) {
      router.push(`/streams/${data?.stream?.id}`);
    }
  }, [data]);
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
          register={register("price", { required: true })}
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
        <Button text="Go live" />
      </form>
    </Layout>
  );
};

export default Create;
