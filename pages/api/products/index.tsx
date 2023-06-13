import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
 
  const {
      body:{name, price, description},
      session: {user}
  } = req

  const product = await client.product.create({
    data: {
        name ,
        image: 'xx',
        price : Number(price),
        description,
        user: {
            connect: {
                id: user?.id
            }
        }

    }
  })
  return res.json({ success: true, product });
}

export default withApiSession(
  withHandler({
      method:"POST",
      handler,
    }
  )
);
