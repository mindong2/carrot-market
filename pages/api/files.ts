import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  // public
  const response = await (
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/direct_upload`,
      {
        method: "POST",
        headers: {
          "Content-type": "aplication/json",
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        },
      }
    )
  ).json();

  /*
    --- private ---
    api 사용을 위한 formData
    const formData = new FormData();
    formData.append("requireSignedURLs", "true");
    formData.append("metadata", JSON.stringify({ key: "value" }));

    const response = await (
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          },
          body: formData,
        }
      )
    ).json();
  */

  return res.json({ success: true, ...response.result });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
