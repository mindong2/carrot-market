import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
  /* req.body에는 email이 있지만 req.body.email을 찍어보면 undefined-> 이를 해결하기위해 client에서 headers 설정 필수
  headers: {
    'Content-Type' : "application/json"
  }
  */
  console.log(req.body.email);
  res.status(200).end();
}
  
export default withHandler('POST', handler);
