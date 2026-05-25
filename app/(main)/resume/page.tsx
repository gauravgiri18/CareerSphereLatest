import { getResume } from "@/actions/resume";
import { ResumeBuilder } from "@/components/resume/resume-builder";
import { AiConfigBanner } from "@/components/ai-config-banner";

export default async function ResumePage() {
  const resume = await getResume();

  return (
    <div className="container mx-auto px-4 py-8">
      <AiConfigBanner />
      <ResumeBuilder initialContent={resume?.content} />
    </div>
  );
}
