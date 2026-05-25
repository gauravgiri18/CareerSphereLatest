import { db } from "@/lib/prisma";
import { withDbRetry } from "@/lib/prisma-retry";

interface ClerkEmailAddress {
  id: string;
  email_address: string;
}

interface ClerkUserResponse {
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  email_addresses: ClerkEmailAddress[];
  primary_email_address_id: string | null;
}

function getPrimaryEmail(clerkUser: ClerkUserResponse): string | null {
  if (clerkUser.primary_email_address_id) {
    const primary = clerkUser.email_addresses.find(
      (e) => e.id === clerkUser.primary_email_address_id
    );
    if (primary?.email_address) return primary.email_address;
  }
  return clerkUser.email_addresses[0]?.email_address ?? null;
}

export async function syncClerkUserToDatabase(clerkUserId: string) {
  const response = await fetch(
    `https://api.clerk.com/v1/users/${clerkUserId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Failed to fetch Clerk user (${response.status}): ${body}`
    );
  }

  const clerkUser = (await response.json()) as ClerkUserResponse;
  const email = getPrimaryEmail(clerkUser);

  if (!email) {
    throw new Error(
      "No email on Clerk account. Add an email in Clerk before continuing."
    );
  }

  const name = [clerkUser.first_name, clerkUser.last_name]
    .filter(Boolean)
    .join(" ");

  return withDbRetry(() =>
    db.user.upsert({
      where: { clerkUserId },
      create: {
        clerkUserId,
        email,
        name: name || null,
        imageURL: clerkUser.image_url,
        skills: [],
      },
      update: {
        email,
        name: name || null,
        imageURL: clerkUser.image_url,
      },
    })
  );
}
