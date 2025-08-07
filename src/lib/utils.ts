import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getSafeImageUrl(
  url: string | null | undefined,
  fallback: string
): string {
  if (!url) {
    return fallback;
  }
  try {
    // Attempt to construct a URL. If it fails, it will throw an error.
    new URL(url);
    return url;
  } catch (error) {
    console.log(error);
    // If the URL is invalid, return the fallback.
    return fallback;
  }
}
