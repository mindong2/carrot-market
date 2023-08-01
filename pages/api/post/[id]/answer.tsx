import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  // product id
  const {
    query: { id },
    session: { user },
    body: { description }
  } = req;

  /* 
    해당 curious에서 productId가 있는지 확인 (findUnique는 unique로만 검색가능하므로 relation으로 검색하기위해 findFirst)
  */
  const Answer = await client.answer.create({
    data: {
        answer: description,
        user: {
            connect: {
            id: user?.id,
            },
        },
        post: {
            connect: {
            id: Number(id),
            },
        },
    },
});
  await res.revalidate("/community");

  res.status(200).json({ success: true, Answer });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);

/*
  prisma client find API 관련 링크
  https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#filter-conditions-and-operators
*/
