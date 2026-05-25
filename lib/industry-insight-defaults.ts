import { db } from "@/lib/prisma";

export async function ensureIndustryInsight(industry: string) {
  const existing = await db.industryInsight.findUnique({
    where: { industry },
  });

  if (existing) return existing;

  return db.industryInsight.create({
    data: {
      industry,
      demandLevels: "HIGH",
      marketOutlook: "POSITIVE",
      growthRate: 7.5,
      topSkills: [
        "Python",
        "JavaScript",
        "Cloud Computing",
        "AWS",
        "Agile",
      ],
      keyTrends: [
        "AI/ML",
        "Cloud Computing",
        "DevOps",
        "Cybersecurity",
        "Remote Work",
      ],
      recommendedSKills: [
        "Python",
        "JavaScript",
        "AWS",
        "Docker",
        "Kubernetes",
      ],
      salaryRanges: [
        { role: "Software Engineer", min: 80, median: 120, max: 180 },
        { role: "Data Scientist", min: 90, median: 130, max: 170 },
        { role: "Frontend Developer", min: 70, median: 110, max: 150 },
        { role: "Backend Developer", min: 85, median: 125, max: 165 },
        { role: "DevOps Engineer", min: 95, median: 135, max: 180 },
        { role: "Mobile Developer", min: 80, median: 120, max: 160 },
      ],
      nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
}
