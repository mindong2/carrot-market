import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query : {id},
    session : {user}
  } = req;
  const product = await client.product.findUnique({
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
    },
  });

  // 해당 상품의 이름에 포함된 단어들 들어가있는 product.name을 찾아온다.
  const terms = product?.name.split(" ").map((term) => {
    return {
      name: {
        contains: term,
      },
    };
  });

  const similarItems = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });

  const isFavorite = Boolean(await client.favorite.findFirst({
    where: {
      userId : user?.id,
      productId: Number(id)
    }
  }))

  res.status(200).json({ success: true, product, isFavorite, similarItems });
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