"use client";

import { Link } from "@/i18n/navigation";

export default function MyDocsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Documents</h1>
      <p className="mb-4">
        This is where your saved documents will be displayed. You can manage
        your documents here, including adding new ones or removing existing
        ones.
      </p>
      <Link href="/" className="text-primary hover:underline">
        &larr; Back to Home
      </Link>
    </div>
  );
}
