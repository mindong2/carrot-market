import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    body: { question },
    session: { user },
  } = req;

  if(req.method === 'POST') {
    const post = await client.post.create({
      data: {
        question,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({ success: true, post });
  }

  if(req.method === 'GET') {
    const post = await client.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            answers: true,
            curiositys: true
          }

        }

      }
    });
    res.json({ success: true, post });
  }
}
export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
