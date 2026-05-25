import { MockInterview } from "@/components/interview/mock-interview";
import { AiConfigBanner } from "@/components/ai-config-banner";

export default function MockInterviewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AiConfigBanner />
      <MockInterview />
    </div>
  );
}
