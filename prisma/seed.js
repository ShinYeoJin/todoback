const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🦡 Starting seed...");

  // Clear existing data
  await prisma.subtask.deleteMany();
  await prisma.todo.deleteMany();

  // Create sample todos
  const todo1 = await prisma.todo.create({
    data: {
      title: "Study Herbology",
      date: new Date("2025-12-03"),
      completed: false,
      position: 0,
      subtasks: {
        create: [
          {
            title: "Read Chapter 5",
            completed: false,
            position: 0,
          },
          {
            title: "Water Mandrakes",
            completed: false,
            position: 1,
          },
        ],
      },
    },
  });

  const todo2 = await prisma.todo.create({
    data: {
      title: "Practice Charms",
      date: new Date("2025-12-03"),
      completed: false,
      position: 1,
      subtasks: {
        create: [
          {
            title: "Learn Levitation Spell",
            completed: false,
            position: 0,
          },
        ],
      },
    },
  });

  const todo3 = await prisma.todo.create({
    data: {
      title: "Finish Potions Essay",
      date: new Date("2025-12-04"),
      completed: false,
      position: 2,
    },
  });

  console.log("✅ Seed completed!");
  console.log({ todo1, todo2, todo3 });
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
