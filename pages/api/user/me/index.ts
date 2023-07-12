import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const profile = await client.user.findUnique({
    where: { id: req.session.user?.id },
  });
  if (req.method === "GET") {
    if (req.session.user) {
      return res.json({ success: true, profile });
    } else {
      return res.json({ success: false });
    }
  }

  if (req.method === "POST") {
    const {
      session: { user },
      body: { name, email, phone, avatarId },
    } = req;

    if (avatarId) {
      const updateProfile = await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          name,
          email,
          phone,
          avatar: avatarId,
        },
      });
      if (updateProfile) {
        return res.json({ success: true, updateProfile, fail: false });
      } else {
        return res.json({ success: false, fail: true });
      }
    } else {
      const updateProfile = await client.user.update({
        where: {
          id: req.session.user?.id,
        },
        data: {
          name,
          email,
          phone,
        },
      });
      if (updateProfile) {
        return res.json({ success: true, updateProfile, fail: false });
      } else {
        return res.json({ success: false, fail: true });
      }
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
