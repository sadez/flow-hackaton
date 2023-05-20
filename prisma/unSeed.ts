const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function unSeed() {

  await prisma.goog.deleteMany()
  await prisma.amzn.deleteMany()
  console.log(`Database has been destroyed. 💀`);

}