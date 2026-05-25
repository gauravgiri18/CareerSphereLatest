import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Serialize Prisma models (Dates, etc.) for Client Components */
export function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
