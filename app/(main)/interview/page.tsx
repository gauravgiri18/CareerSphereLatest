import { getAssessments } from "@/actions/interview";
import { PerformanceChart } from "@/components/interview/performance-chart";
import { QuizList } from "@/components/interview/quiz-list";
import { AiConfigBanner } from "@/components/ai-config-banner";
import { serialize } from "@/lib/utils";

export default async function InterviewPage() {
  const assessments = serialize(await getAssessments());

  const avgScore =
    assessments.length > 0
      ? assessments.reduce((sum, a) => sum + a.quizScore, 0) /
        assessments.length
      : 0;

  const totalQuestions = assessments.length * 10;
  const latestScore =
    assessments.length > 0
      ? assessments[assessments.length - 1].quizScore
      : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <AiConfigBanner />
      <h1 className="text-4xl font-bold text-white mb-8">Interview Prep</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-white/60 text-sm mb-1">Average Score</p>
          <p className="text-3xl font-bold text-white">
            {avgScore.toFixed(0)}%
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-white/60 text-sm mb-1">Total Questions</p>
          <p className="text-3xl font-bold text-white">{totalQuestions}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-white/60 text-sm mb-1">Latest Score</p>
          <p className="text-3xl font-bold text-white">
            {latestScore.toFixed(0)}%
          </p>
        </div>
      </div>

      {assessments.length > 0 && (
        <div className="mb-8">
          <PerformanceChart assessments={assessments} />
        </div>
      )}

      <QuizList assessments={assessments} />
    </div>
  );
}
