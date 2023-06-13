// Next.js에서 실행될 함수 맞춤 설정

import { NextApiRequest, NextApiResponse } from "next";

export interface ResponseType {
  success: boolean;
  [key: string]: any;
}

interface configType {
  method: "GET" | "POST" | "DELETE";
  handler: (req: NextApiRequest, res: NextApiResponse) => void,
  isPrivate ?: boolean
}

export default function withHandler({method, handler, isPrivate = true} : configType) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== method) {
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
