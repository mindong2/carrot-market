// Next.js에서 실행될 함수 맞춤 설정

import { NextApiRequest, NextApiResponse } from "next";

type HandlerMethodType = "GET" | "POST" | "DELETE";
type HandlerFnType = (req: NextApiRequest, res: NextApiResponse) => void;

export default function withHandler(method: HandlerMethodType, fn: HandlerFnType) {
    return async function(req: NextApiRequest, res: NextApiResponse) {
        if(req.method !== method) {
            res.status(405).end();
        }
        try{
            await fn(req, res);
        }catch(err){
            console.log(err)
            res.status(500).json({err});
        }
    }
}
