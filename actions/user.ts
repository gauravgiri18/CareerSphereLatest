"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { syncClerkUserToDatabase } from "@/lib/sync-clerk-user";
import { ensureIndustryInsight } from "@/lib/industry-insight-defaults";

export async function checkUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return syncClerkUserToDatabase(userId);
}

interface UpdateUserData {
  industry: string;
  experience: number;
  bio: string;
  skills: string[];
}

export async function updateUser(data: UpdateUserData) {
  const user = await checkUser();

  await ensureIndustryInsight(data.industry);

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      industry: data.industry,
      experience: data.experience,
      bio: data.bio,
      skills: data.skills,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
  return updatedUser;
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) return { isOnboarded: false };

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  return { isOnboarded: !!user?.industry };
}
