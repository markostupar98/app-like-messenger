// import  {PrismaClient}  from "@prisma/client";

// declare global {
//     var prisma:PrismaClient | undefined
// }

// const client = globalThis.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

// export default client;

import { PrismaClient } from "@prisma/client";

// Initialize Prisma client instance
const prisma = new PrismaClient();

// Export Prisma client instance
export default prisma;
