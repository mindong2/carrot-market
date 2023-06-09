import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    session: { user },
  } = req;
  const sales = await client.sale.findMany({
    where: { userId: user?.id },
    include: {
      product: {
        include: {
          _count: {
            select: {
              sales: true,
            },
          },
        },
      },
    },
  });

  if (req.session.user) {
    return res.json({ success: true, sales });
  } else {
    return res.json({ success: false });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
