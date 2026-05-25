"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { getDbUser } from "@/lib/db-user";
import { generateGeminiContent } from "@/lib/gemini";
import { isAnswerCorrect, normalizeQuizQuestions } from "@/lib/quiz-utils";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export async function generateQuiz(): Promise<QuizQuestion[]> {
  const user = await getDbUser();

  const industry = user.industry || "Technology";
  const experience = user.experience ?? 0;
  const skills = user.skills.join(", ") || "general skills";

  const prompt = `Generate 10 technical interview questions for a ${industry} professional with ${experience} years experience.
Skills: ${skills}
Return ONLY a valid JSON array. Each item must follow this format exactly:
{
  "question": "Question text here?",
  "options": ["Full answer option 1", "Full answer option 2", "Full answer option 3", "Full answer option 4"],
  "correctAnswer": "Full answer option 1",
  "explanation": "Why this is correct"
}
CRITICAL: correctAnswer MUST be the exact same string as one of the options (not just "A" or "B").`;

  const text = await generateGeminiContent(prompt);
  const jsonMatch = text.match(/\[[\s\S]*\]/);

  if (!jsonMatch) throw new Error("Failed to parse quiz questions from AI response");

  const parsed = JSON.parse(jsonMatch[0]) as QuizQuestion[];
  return normalizeQuizQuestions(parsed);
}

interface SaveQuizResultData {
  questions: QuizQuestion[];
  answers: Record<number, string>;
  score: number;
}

export async function saveQuizResult({
  questions,
  answers,
  score,
}: SaveQuizResultData) {
  const user = await getDbUser();

  const wrongAnswers = questions.filter((q, i) => {
    return !isAnswerCorrect(answers[i], q);
  });

  let improvementTip: string | null = null;

  if (wrongAnswers.length > 0) {
    const tipPrompt = `A ${user.industry || "professional"} candidate scored ${score}% on an interview quiz.
They got these questions wrong:
${wrongAnswers.map((q) => `- ${q.question}: Correct answer was ${q.correctAnswer}`).join("\n")}
Provide a brief, actionable improvement tip (2-3 sentences). Return ONLY the tip text.`;

    improvementTip = await generateGeminiContent(tipPrompt);
  }

  const questionsData = questions.map((q, i) => ({
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    userAnswer: answers[i] || null,
  }));

  const assessment = await db.assessment.create({
    data: {
      userId: user.id,
      quizScore: score,
      questions: questionsData,
      category: user.industry || "General",
      improvementTip,
    },
  });

  revalidatePath("/interview");
  return assessment;
}

export async function getAssessments() {
  const user = await getDbUser();

  return db.assessment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });
}
