"use client";

import { Link } from "@/i18n/navigation";

export default function BookmarksPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Bookmarks Page</h1>
      <p className="mb-4">
        This is where your saved bookmarks will be displayed. You can manage
        your bookmarks here, including adding new ones or removing existing
        ones.
      </p>
      <Link href="/" className="text-primary hover:underline">
        &larr; Back to Home
      </Link>
    </div>
  );
}
