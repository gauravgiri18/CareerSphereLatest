import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const insight = await db.industryInsight.create({
    data: {
      industry: "Technology",
      demandLevels: "HIGH",
      marketOutlook: "POSITIVE",
      growthRate: 7.5,
      topSkills: ["Python", "JavaScript"],
      keyTrends: ["AI/ML"],
      recommendedSKills: ["AWS"],
      salaryRanges: [
        { role: "Software Engineer", min: 80, median: 120, max: 180 },
      ],
      nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
  console.log("Created:", insight.id);

  const user = await db.user.findFirst();
  if (user) {
    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        industry: "Technology",
        experience: 2,
        bio: "Test bio for onboarding",
        skills: ["Python", "React"],
      },
    });
    console.log("Updated user:", updated.email, updated.industry);
  }
}

main()
  .catch((e) => console.error("ERROR:", e))
  .finally(() => db.$disconnect());
