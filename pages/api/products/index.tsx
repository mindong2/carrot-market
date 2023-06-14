import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
 
  if(req.method === 'POST') {
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

  if(req.method === 'GET') {
    const product = await client.product.findMany({})
    
    return res.json({success: true, product})
  }
}

export default withApiSession(
  withHandler({
      methods:['GET','POST'],
      handler,
    }
  )
);
