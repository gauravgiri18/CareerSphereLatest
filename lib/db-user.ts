import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { withDbRetry } from "@/lib/prisma-retry";
import { syncClerkUserToDatabase } from "@/lib/sync-clerk-user";

export async function getDbUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return withDbRetry(async () => {
    const existing = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (existing) return existing;

    return syncClerkUserToDatabase(userId);
  });
}
