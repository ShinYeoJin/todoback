const { PrismaClient } = require("@prisma/client");

// Singleton pattern for Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient(); // 기본 설정 사용
};

const globalForPrisma = global;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on("beforeExit", async () => {
  console.log("Disconnecting from database...");
  try {
    await prisma.$disconnect();
    console.log("Disconnected successfully.");
  } catch (error) {
    console.error("Failed to disconnect from database:", error);
  }
});

module.exports = prisma;
