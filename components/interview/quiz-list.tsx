"use client";

import Link from "next/link";
import { Assessment } from "@prisma/client";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface QuizListProps {
  assessments: Assessment[];
}

export function QuizList({ assessments }: QuizListProps) {
  if (assessments.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
        <p className="text-white/60 mb-6">No quizzes yet. Start your first mock interview!</p>
        <Link href="/interview/mock">
          <Button className="bg-white text-black hover:bg-white/90 font-semibold">
            Start Quiz
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Quiz History</h2>
        <Link href="/interview/mock">
          <Button className="bg-white text-black hover:bg-white/90 font-semibold">
            Start New Quiz
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {assessments.map((assessment, index) => (
          <div
            key={assessment.id}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">
                Quiz {index + 1}
              </h3>
              <span className="text-white/60 text-sm">
                {format(new Date(assessment.createdAt), "dd/MM/yyyy")}
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-2">
              Score: {assessment.quizScore.toFixed(0)}%
            </p>
            {assessment.improvementTip && (
              <p className="text-white/60 text-sm border-t border-white/10 pt-4 mt-4">
                <span className="text-white/80 font-medium">Tip: </span>
                {assessment.improvementTip}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
