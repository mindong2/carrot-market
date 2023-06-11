/*
nodeMailer

1. 네이버 이메일 -> 내 메일함 오른쪽 설정버튼 클릭 -> 상단 메뉴들 중 'POP/IMAP 설정' -> 바로 아래에 'IMAP/SMTP 설정' -> 사용함, 동기화 메일 제한은 1000으로 해놓았습니다.

2. 하단에 보시면 SMTP 서버 명, SMTP 포트가 표시되어있습니다.

3. server폴더 내에 email.ts를 만들어줍니다.

4. npm install --save nodemailer @types/nodemailer

5. 필요한곳에서 사용 (enter.tsx)
*/

import nodemailer from "nodemailer";

const smtpTransport = nodemailer.createTransport({
  service: "Naver",
  host: "smtp.naver.com",
  port: 587,
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default smtpTransport;
