import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { syncClerkUserToDatabase } from "@/lib/sync-clerk-user";
import { Header } from "@/components/header";

export default async function MainLayout({
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

  if (!user?.industry) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-16">{children}</main>
    </div>
  );
}
