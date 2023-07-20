import type { NextPage } from "next";
import Button from "../../components/button";
import Input from "../../components/input";
import Layout from "../../components/layout";
import useUser from "@/libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useMutation from "@/libs/client/useMutation";
import { useRouter } from "next/router";
import { User } from "@prisma/client";
import { cloudflareGetImage } from "@/libs/client/utils";
import Image from "next/image";

interface Iform {
  name: string;
  email: string;
  phone: string;
  avatar: FileList;
}

interface editFormType {
  success: boolean;
  profile: User;
  fail: boolean;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const [edit, { data, loading }] = useMutation<editFormType>("/api/user/me");
  const [avatarPreview, setAvatarPreview] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<Iform>();
  const onValid = async ({ name, email, phone, avatar }: Iform) => {
    if (name === "") {
      setError("root", { message: "이름은 필수입니다." });
      return;
    } else if (email && email === "") {
      setError("root", { message: "이메일은 필수입니다." });
      return;
    } else if (phone && phone === "") {
      setError("root", { message: "휴대폰 번호는 필수입니다." });
      return;
    }

    if (loading) return;

    if (window.confirm("정말로 수정하시겠습니까?")) {
      if (avatar && avatar?.length > 0) {
        // https://developers.cloudflare.com/images/cloudflare-images/upload-images/direct-creator-upload/#direct-creator-upload -> API설명란
        const { uploadURL } = await (await fetch("/api/files")).json();

        const form = new FormData();
        form.append("file", avatar[0], String(user?.id));
        const {
          result: { id: avatarId },
        } = await (
          await fetch(uploadURL, {
            method: "POST",
            body: form,
          })
        ).json();
        edit({ name, email, phone, avatarId });
      } else {
        edit({ name, email, phone });
      }
    }
  };

  const avatar = watch("avatar");

  useEffect(() => {
    if (avatar && avatar?.length > 0) {
      const file = avatar[0];
      // URL.createObjectURL(file) -> 주어진 객체를 가리키는 URL을 DOMString으로 반환
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);

  useEffect(() => {
    if (user?.name) setValue("name", user?.name);
    if (user?.email) setValue("email", user?.email);
    if (user?.phone) setValue("phone", user?.phone);
    if (user?.avatar) setAvatarPreview(cloudflareGetImage(user?.avatar, "avatar"));
    console.log(user);
  }, [user, setValue]);

  useEffect(() => {
    if (data?.success && !data.fail) {
      alert("수정이 완료되었습니다!");
      router.push("/profile");
    } else if (!data?.success && data?.fail) {
      alert("수정에 실패했습니다 다시 시도해주세요.");
    }
  }, [data, router]);

  return (
    <Layout canGoBack title="Edit Profile">
      <form className="space-y-4 px-4 py-10" onSubmit={handleSubmit(onValid)}>
        <div className="flex items-center space-x-3">
          {avatarPreview ? (
            <Image src={avatarPreview} alt="" className="h-14 w-14 rounded-full bg-slate-500" />
          ) : (
            <div className="h-14 w-14 rounded-full bg-slate-500"></div>
          )}
          <label
            htmlFor="picture"
            className="cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Change
            <input {...register("avatar")} id="picture" type="file" className="hidden" accept="image/*" />
          </label>
        </div>
        <Input register={register("name")} required label="이름" name="text" type="text" />
        {!user?.email ? (
          <>
            <Input register={register("phone")} required={false} label="휴대폰 번호" name="phone" type="number" kind="phone" />
          </>
        ) : (
          <>
            <Input register={register("email")} required={false} label="이메일" name="email" type="email" />
          </>
        )}
        {errors.root ? <span className="block py-1 font-medium text-red-500">{errors.root.message}</span> : null}
        <Button text={loading ? "Loading..." : "Update profile"} />
      </form>
    </Layout>
  );
};

export default EditProfile;

/*
  Direct Creator Upload
  
  유저의 브라우저가 cloudflare에 다이렉트로 업로드할 수 있습니다.
  Cloudflare 이미지의 Direct Creator Upload 기능을 사용하면 사용자가 일회성 업로드 URL로 사진을 업로드할 수 있습니다. Direct Creator Upload를 사용하면 API 키 또는 토큰을 클라이언트에 노출하지 않고 업로드를 수락할 수 있습니다.
  또한 중간 스토리지 버킷 및 이와 관련된 스토리지/송신 비용이 필요하지 않습니다.
  ```
  curl --request POST \
  --url https://api.cloudflare.com/client/v4/accounts//images/v2/direct_upload \
  --header 'Authorization: Bearer :token' \
  --form 'requireSignedURLs=true' \
  --form 'metadata={"key":"value"}'
  ```
  https://developers.cloudflare.com/images/cloudflare-images/upload-images/direct-creator-upload/ 
*/
