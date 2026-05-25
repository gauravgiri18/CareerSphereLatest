import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { syncClerkUserToDatabase } from "@/lib/sync-clerk-user";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await syncClerkUserToDatabase(userId);

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (user?.industry) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
