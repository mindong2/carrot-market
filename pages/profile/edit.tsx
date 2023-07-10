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
  const onValid = ({ name, email, phone, avatar }: Iform) => {
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
      edit({ name, email, phone });
    }
  };

  const avatar = watch("avatar");

  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      // URL.createObjectURL(file) -> 주어진 객체를 가리키는 URL을 DOMString으로 반환
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);

  useEffect(() => {
    if (user?.name) setValue("name", user?.name);
    if (user?.email) setValue("email", user?.email);
    if (user?.phone) setValue("phone", user?.phone);
  }, [user, setValue]);

  useEffect(() => {
    if (data?.success && !data.fail) {
      alert("수정이 완료되었습니다!");
      router.push("/profile");
    } else if (!data?.success && data?.fail) {
      alert("수정에 실패했습니다 다시 시도해주세요.");
    }
  }, [data]);

  return (
    <Layout canGoBack title="Edit Profile">
      <form className="space-y-4 px-4 py-10" onSubmit={handleSubmit(onValid)}>
        <div className="flex items-center space-x-3">
          {avatar.length > 0 ? (
            <img src={avatarPreview} className="h-14 w-14 rounded-full bg-slate-500" />
          ) : (
            <div className="h-14 w-14 rounded-full bg-slate-500"></div>
          )}
          <label
            htmlFor="picture"
            className="cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Change
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input register={register("name")} required label="이름" name="text" type="text" />
        {!user?.email ? (
          <>
            <Input
              register={register("phone")}
              required={false}
              label="휴대폰 번호"
              name="phone"
              type="number"
              kind="phone"
            />
          </>
        ) : (
          <>
            <Input
              register={register("email")}
              required={false}
              label="이메일"
              name="email"
              type="email"
            />
          </>
        )}
        {errors.root ? (
          <span className="block py-1 font-medium text-red-500">{errors.root.message}</span>
        ) : null}
        <Button text={loading ? "Loading..." : "Update profile"} />
      </form>
    </Layout>
  );
};

export default EditProfile;
