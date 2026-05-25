"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { getDbUser } from "@/lib/db-user";
import { generateGeminiContent } from "@/lib/gemini";

interface GenerateCoverLetterData {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
}

export async function generateCoverLetter(data: GenerateCoverLetterData) {
  const user = await getDbUser();

  const prompt = `Write a professional cover letter for the following:

Candidate Profile:
- Name: ${user.name || "Candidate"}
- Industry: ${user.industry || "Professional"}
- Experience: ${user.experience ?? 0} years
- Skills: ${user.skills.join(", ") || "Various professional skills"}
- Bio: ${user.bio || "Experienced professional"}

Job Details:
- Position: ${data.jobTitle}
- Company: ${data.companyName}
- Job Description: ${data.jobDescription}

Write a compelling, personalized cover letter. Return ONLY the cover letter text.`;

  const content = await generateGeminiContent(prompt);

  const coverLetter = await db.coverLetter.create({
    data: {
      userId: user.id,
      content,
      jobDescription: data.jobDescription,
      companyName: data.companyName,
      jobTitle: data.jobTitle,
    },
  });

  revalidatePath("/ai-cover-letter");
  return coverLetter;
}

export async function getCoverLetters() {
  const user = await getDbUser();

  return db.coverLetter.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteCoverLetter(id: string) {
  const user = await getDbUser();

  const letter = await db.coverLetter.findUnique({
    where: { id },
  });

  if (!letter || letter.userId !== user.id) {
    throw new Error("Cover letter not found");
  }

  await db.coverLetter.delete({ where: { id } });

  revalidatePath("/ai-cover-letter");
}
