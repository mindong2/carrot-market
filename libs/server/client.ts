import { PrismaClient } from "@prisma/client";

declare global {
    var client : PrismaClient | undefined;
}

// 여러개의 PrismaClient가 만들어지므로 개발환경일때는 하나로 관리

const client = global.client || new PrismaClient;

if(process.env.NODE_ENV === 'development') global.client = new PrismaClient

export default client;

// client.user 확인가능
