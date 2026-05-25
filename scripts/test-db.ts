import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const userCount = await db.user.count();
  const insightCount = await db.industryInsight.count();
  const onboarded = await db.user.count({
    where: { industry: { not: null } },
  });
  console.log("User count:", userCount);
  console.log("Onboarded users:", onboarded);
  console.log("IndustryInsight count:", insightCount);
}

main()
  .catch((e) => console.error("DB ERROR:", e))
  .finally(() => db.$disconnect());
