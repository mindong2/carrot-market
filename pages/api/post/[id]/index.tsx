import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { id },
    session: {user}
  } = req;

  const post = await client.post.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      answers: {
        select: {
          answer: true,
          id: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      curiositys: {
        select: {
          id : true,
          postId: true,
          userId: true
        }
      },
      _count: {
        select: {
          answers: true,
          curiositys: true
        },
      },
    },
  });

  const isCurious = Boolean(await client.curiosity.findFirst({
    where: {
      userId : user?.id,
      postId: Number(id)
    }
  }))

  res.status(200).json({ success: true, post, isCurious });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);

/*
  prisma client find API 관련 링크
  https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#filter-conditions-and-operators
*/
