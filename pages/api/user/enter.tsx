import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import smtpTransport from "@/libs/server/email";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  /* req.body에는 email이 있지만 req.body.email을 찍어보면 undefined-> 이를 해결하기위해 client에서 headers 설정 필수
  headers: {
    'Content-Type' : "application/json"
  }
  */
  const { phone, email } = req.body;
  const user = phone ? { phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ success: false });

  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      // payload 생성, user가 없다면 create, 있다면 connect
      user: {
        connectOrCreate: {
          create: {
            name: "Anonymous",
            ...user,
          },
          where: {
            ...user,
          },
        },
      },
    },
  });
  console.log(token)
  // 휴대폰 인증시
  if (phone) {
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   // !는 해당 환경변수가 무조건 존재한다는 의미.
    //   to: process.env.MY_PHONE!,
    //   body: `로그인 인증번호는 ${payload}입니다.`,
    // });
    const message = "done";
    console.log(message);
  }

  // 이메일 인증시
  if (email) {
    // const mailOptions = {
    //   from: process.env.MAIL_ID,
    //   to: email,
    //   subject: "이메일 인증번호입니다.",
    //   text: `인증번호는 : ${payload} 입니다.`,
    // };

    // const result = await smtpTransport.sendMail(mailOptions, (error, responses) => {
    //   if (error) {
    //     console.log(error);
    //     return null;
    //   } else {
    //     console.log(responses);
    //     return null;
    //   }
    // });
    // smtpTransport.close();
    console.log('done');
  }
  return res.status(200).json({ success: true });
}


export default withHandler(
  {
    methods: ["POST"], 
    handler,
    isPrivate:false
  }
);
