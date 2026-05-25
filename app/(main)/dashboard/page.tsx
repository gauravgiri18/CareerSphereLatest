import { getIndustryInsights } from "@/actions/dashboard";
import { IndustryInsights } from "@/components/dashboard/industry-insights";
import { AiConfigBanner } from "@/components/ai-config-banner";
import { serialize } from "@/lib/utils";

export default async function DashboardPage() {
  const insights = serialize(await getIndustryInsights());

  return (
    <div className="container mx-auto px-4 py-8">
      <AiConfigBanner />
      <IndustryInsights insights={insights} />
    </div>
  );
}
