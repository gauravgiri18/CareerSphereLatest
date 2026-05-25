"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import {
  generateQuiz,
  saveQuizResult,
  type QuizQuestion,
} from "@/actions/interview";
import { isAnswerCorrect } from "@/lib/quiz-utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type QuizState = "start" | "quiz" | "results";

export function MockInterview() {
  const router = useRouter();
  const [state, setState] = useState<QuizState>("start");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finalAnswers, setFinalAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const quiz = await generateQuiz();
      setQuestions(quiz);
      setState("quiz");
      setCurrentQ(0);
      setAnswers({});
      setSelectedOption(null);
    } catch {
      toast.error("Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const newAnswers = { ...answers, [currentQ]: selectedOption };
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOption(newAnswers[currentQ + 1] || null);
    } else {
      setFinalAnswers(newAnswers);
      setState("results");
    }
  };

  const calculateScore = (answerMap: Record<number, string>) => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (isAnswerCorrect(answerMap[i], q)) correct++;
    });
    return (correct / questions.length) * 100;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const score = calculateScore(finalAnswers);
      await saveQuizResult({
        questions,
        answers: finalAnswers,
        score,
      });
      router.push("/interview");
    } catch {
      toast.error("Failed to save results");
      setSaving(false);
    }
  };

  if (state === "start") {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Mock Interview</h1>
        <p className="text-white/60 mb-8">
          Test your skills with 10 AI-generated technical questions tailored to
          your industry and experience level.
        </p>
        <Button
          onClick={startQuiz}
          disabled={loading}
          className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-6 text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Quiz...
            </>
          ) : (
            "Start Quiz"
          )}
        </Button>
      </div>
    );
  }

  if (state === "quiz" && questions.length > 0) {
    const question = questions[currentQ];
    const progress = ((currentQ + 1) / questions.length) * 100;
    const isLast = currentQ === questions.length - 1;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between text-white/60 text-sm mb-2">
            <span>
              Question {currentQ + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress
            value={progress}
            className="bg-white/10 [&>div]:bg-white"
          />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            {question.question}
          </h2>
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedOption(option)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedOption === option
                    ? "border-white bg-white/10 text-white"
                    : "border-white/10 text-white/80 hover:bg-white/5"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleNext}
          disabled={!selectedOption}
          className="w-full bg-white text-black hover:bg-white/90 font-semibold"
        >
          {isLast ? "Finish" : "Next"}
        </Button>
      </div>
    );
  }

  const score = calculateScore(finalAnswers);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Quiz Complete!</h1>
        <p className="text-6xl font-bold text-white">{score.toFixed(0)}%</p>
      </div>

      <div className="space-y-4 mb-8">
        {questions.map((q, i) => {
          const userAnswer = finalAnswers[i];
          const correct = isAnswerCorrect(userAnswer, q);

          return (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-start gap-3 mb-3">
                {correct ? (
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                ) : (
                  <X className="h-5 w-5 text-red-500 shrink-0 mt-1" />
                )}
                <p className="text-white font-medium">{q.question}</p>
              </div>
              {!correct && (
                <div className="ml-8 space-y-1 text-sm">
                  <p className="text-red-400">
                    Your answer: {userAnswer || "No answer"}
                  </p>
                  <p className="text-green-400">
                    Correct answer: {q.correctAnswer}
                  </p>
                  <p className="text-white/60">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-white text-black hover:bg-white/90 font-semibold"
      >
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save & View Performance"
        )}
      </Button>
    </div>
  );
}
