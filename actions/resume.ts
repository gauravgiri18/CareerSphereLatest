"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { getDbUser } from "@/lib/db-user";
import { generateGeminiContent } from "@/lib/gemini";

export async function saveResume(content: string) {
  const user = await getDbUser();

  const resume = await db.resume.upsert({
    where: { userId: user.id },
    create: { userId: user.id, content },
    update: { content },
  });

  revalidatePath("/resume");
  return resume;
}

export async function getResume() {
  const user = await getDbUser();

  return db.resume.findUnique({
    where: { userId: user.id },
  });
}

export async function improveWithAI({
  current,
  type,
}: {
  current: string;
  type: string;
}) {
  const user = await getDbUser();

  const industry = user.industry || "professional";
  const prompt = `Improve this ${type} for a ${industry} professional. Make it ATS-optimized, achievement-focused with metrics. Current: ${current}. Return ONLY the improved text.`;

  return generateGeminiContent(prompt);
}
