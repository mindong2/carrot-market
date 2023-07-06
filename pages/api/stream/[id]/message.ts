import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    body,
    session: { user },
    query: { id },
  } = req;

  const message = await client.message.create({
    data: {
      message: body?.message,
      user: {
        connect: {
          id: user?.id,
        },
      },
      stream: {
        connect: {
          id: Number(id),
        },
      },
    },
  });

  if (message) {
    return res.json({ success: true, message });
  } else {
    return res.json({ success: false });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
