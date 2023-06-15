import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  // product id
  const {
    query: { id },
    session: { user },
  } = req;

  /* 
    해당 favorite에서 productId가 있는지 확인 (findUnique는 unique로만 검색가능하므로 relation으로 검색하기위해 findFirst)
  */
  const favExist = await client.favorite.findFirst({
    // 좋아요 버튼을 누른 유저와, 해당 상품의 id 존재유무 확인 있으면 delete
    where: {
      productId: Number(id),
      userId: user?.id,
    },
  });

  if (favExist) {
    await client.favorite.delete({
      // delete는 unique인 요소로만 판별가능
      where: {
        id: Number(favExist.id),
      },
    });
  } else {
    await client.favorite.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: Number(id),
          },
        },
      },
    });
  }

  res.status(200).json({ success: true });
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
