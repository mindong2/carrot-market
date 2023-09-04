import type { GetServerSideProps, NextPage } from "next";
import Input from "../../components/input";
import Layout from "../../components/layout";
import { cloudflareGetImage } from "@/libs/client/utils";
import Image from "next/image";

interface IProfile {
  userProfile: {
    phone: string;
    email: string;
    name: string;
    avatar: string;
  };
}

const ViewProfile: NextPage<IProfile> = ({ userProfile }) => {
  return (
    <Layout canGoBack title={`${userProfile?.name}의 프로필`}>
      <div className="mb-8 mt-14 flex items-center justify-center space-x-3">
        {userProfile?.avatar ? (
          <Image
            src={cloudflareGetImage(userProfile?.avatar, "list")}
            alt=""
            width={140}
            height={140}
            priority
            className="h-48 w-48 rounded-full border-2 border-gray-200 bg-slate-500"
          />
        ) : (
          <div className="h-48 w-48 rounded-full bg-slate-500"></div>
        )}
      </div>
      <div className="space-y-3">
        <Input label="이름" name="text" type="text" readOnly="readOnly" value={userProfile?.name} />
        {!userProfile?.email ? (
          <>
            <Input
              label="휴대폰 번호"
              name="phone"
              type="number"
              kind="phone"
              readOnly="readOnly"
              value={userProfile?.phone}
            />
          </>
        ) : (
          <>
            <Input
              label="이메일"
              name="email"
              type="email"
              readOnly="readOnly"
              value={userProfile?.email}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const userProfile = await client.user.findUnique({
    where: {
      id: Number(ctx?.params?.id),
    },
    select: {
      phone: true,
      email: true,
      name: true,
      avatar: true,
    },
  });

  if (ctx?.params?.id) {
    return {
      props: {
        userProfile: JSON.parse(JSON.stringify(userProfile)),
      },
    };
  }
};

export default ViewProfile;
