import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  if (req.method === "GET") {
    const {
      query: { page },
    } = req;
    const stream = await client.stream.findMany({
      // take 노출개수, skip 스킵 개수 pagination
      take: 10,
      skip: 10 * (Number(page) - 1),
    });
    if (!stream) {
      return res.json({ success: false });
    }
    return res.json({ success: true, stream });
  }

  if (req.method === "POST") {
    const {
      body: { title, price, description },
      session: { user },
    } = req;

    const stream = await client.stream.create({
      data: {
        title,
        price,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    if (stream) {
      return res.json({ success: true, stream });
    } else {
      return res.json({ success: false });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
