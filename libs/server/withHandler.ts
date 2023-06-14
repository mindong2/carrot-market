// Next.js에서 실행될 함수 맞춤 설정

import { NextApiRequest, NextApiResponse } from "next";

export interface ResponseType {
  success: boolean;
  [key: string]: any;
}

type methods = "GET" | "POST" | "DELETE";

interface configType {
  methods: methods[];
  handler: (req: NextApiRequest, res: NextApiResponse) => void,
  isPrivate ?: boolean
}

export default function withHandler({methods, handler, isPrivate = true} : configType) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method && !methods.includes(req.method as any)) {
      res.status(405).end();
    }
    if(isPrivate && !req.session.user) {
      return res.status(401).json({success:false, message: '로그인을 해주세요'})
    }
    try {
      await handler(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  };
}
