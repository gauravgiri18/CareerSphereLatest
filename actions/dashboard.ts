"use server";

import { getDbUser } from "@/lib/db-user";
import { ensureIndustryInsight } from "@/lib/industry-insight-defaults";

export async function getIndustryInsights() {
  const user = await getDbUser();

  if (!user.industry) {
    throw new Error(
      "Please complete onboarding first to select your industry."
    );
  }

  return ensureIndustryInsight(user.industry);
}
