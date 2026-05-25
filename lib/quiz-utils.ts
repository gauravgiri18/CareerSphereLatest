import type { QuizQuestion } from "@/actions/interview";

/** Resolve letter (A-D) or partial text to the full option string */
export function resolveOptionAnswer(
  answer: string,
  options: string[]
): string {
  const trimmed = answer.trim();
  if (!trimmed || options.length === 0) return trimmed;

  if (options.includes(trimmed)) return trimmed;

  const letter = trimmed.toUpperCase().replace(/[^A-D]/g, "").charAt(0);
  if (/^[A-D]$/.test(letter)) {
    const index = letter.charCodeAt(0) - 65;
    if (options[index]) return options[index];

    const prefixMatch = options.find((opt) => {
      const upper = opt.trim().toUpperCase();
      return (
        upper.startsWith(`${letter})`) ||
        upper.startsWith(`${letter}.`) ||
        upper.startsWith(`${letter}:`) ||
        upper.startsWith(`${letter} `)
      );
    });
    if (prefixMatch) return prefixMatch;
  }

  const fuzzy = options.find(
    (opt) =>
      opt.trim().toLowerCase() === trimmed.toLowerCase() ||
      opt.trim().toLowerCase().includes(trimmed.toLowerCase())
  );
  return fuzzy ?? trimmed;
}

export function isAnswerCorrect(
  userAnswer: string | undefined,
  question: QuizQuestion
): boolean {
  if (!userAnswer) return false;
  const resolvedUser = resolveOptionAnswer(userAnswer, question.options);
  const resolvedCorrect = resolveOptionAnswer(
    question.correctAnswer,
    question.options
  );
  return resolvedUser === resolvedCorrect;
}

export function normalizeQuizQuestions(raw: QuizQuestion[]): QuizQuestion[] {
  return raw.map((q) => {
    const options = q.options.map((o) => String(o).trim()).filter(Boolean);
    const correctAnswer = resolveOptionAnswer(
      String(q.correctAnswer),
      options
    );

    return {
      question: q.question,
      options: options.length >= 2 ? options : ["A", "B", "C", "D"],
      correctAnswer:
        options.includes(correctAnswer) && correctAnswer
          ? correctAnswer
          : options[0] ?? "A",
      explanation: q.explanation,
    };
  });
}
