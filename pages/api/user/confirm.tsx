import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const { token } = req.body;

  const existUser = await client.token.findUnique({
    where: {
      payload: token,
    },
    // prisma schema에서 User model과 연결되어있으므로 원할경우 하단 코드 추가가능
    include: { user: true },
  });
  if (!existUser) return res.status(404).end();
  req.session.user = {
    id: existUser.userId,
  };
  await req.session.save();
  // 기존에 token을 가지고있던것들을 전부 삭제
  await client.token.deleteMany({
    where: {
      userId: existUser.userId,
    },
  });
  res.json({ success: true });
}

// private page
export default withApiSession(
  withHandler(
    {
      methods:["POST"],
      handler,
      isPrivate:true
    }
  )
  );
