import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  if (req.method === "POST") {
    const {
      body: { question, latitude, longitude },
      session: { user },
    } = req;
    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    // POST로 들어온 요청에 대한 응답 시 /community 페이지를 revalidate (ISR)
    await res.revalidate("/community");

    res.json({ success: true, post });
  }

  if (req.method === "GET") {
    const {
      query: { latitude, longitude },
    } = req;
    const FloatLantitude = latitude ? parseFloat(latitude.toString()) : 0;
    const FloatLongitude = longitude ? parseFloat(longitude?.toString()) : 0;
    const post = await client.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            answers: true,
            curiositys: true,
          },
        },
      },
      // 동네 범위
      // where: {
      //   latitude: {
      //     // gte = 크거나 같다, lte = 작거나 같다
      //     gte: FloatLantitude - 0.01,
      //     lte: FloatLantitude + 0.01,
      //   },
      //   longitude: {
      //     gte: FloatLongitude - 0.01,
      //     lte: FloatLongitude + 0.01,
      //   },
      // },
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
