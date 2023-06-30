import type { NextPage } from "next";
import Button from "@/components/button";
import Layout from "@/components/layout";
import TextArea from "@/components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import { Post } from "@prisma/client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useCoords from "@/libs/client/useCoords";
import useUser from "@/libs/client/useUser";

interface IWrite {
  question: string;
  latitude: number | null;
  longitude: number | null;
}

interface PostResponse {
  success: boolean;
  post: Post;
}

const Write: NextPage = () => {
  const { user, isLoading } = useUser();
  const { latitude, longitude } = useCoords();
  const router = useRouter();
  const { register, handleSubmit } = useForm<IWrite>();
  const [post, { data: postData, loading }] = useMutation<PostResponse>("/api/post");
  const onValid = (data: IWrite) => {
    if (loading) return;
    post({ ...data, latitude, longitude });
  };

  useEffect(() => {
    if (postData && postData.success) {
      router.push(`/community/${postData?.post.id}`);
    }
  }, [postData, router]);

  return (
    <Layout canGoBack title="Write Post">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 p-4">
        <TextArea register={register("question", { required: true, minLength: 5 })} required placeholder="Ask a question!" />

        <Button text={loading ? "게시중..." : "질문하기"} />
      </form>
    </Layout>
  );
};

export default Write;
