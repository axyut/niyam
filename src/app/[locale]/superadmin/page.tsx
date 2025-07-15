"use client";

import { Link } from "@/i18n/navigation";

export default function SuperadminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Superadmin</h1>
      <p className="mb-4">
        This page will display analytics and statistics related to the
        platform's usage, user engagement, and other relevant metrics.
      </p>
      <Link href="/" className="text-primary hover:underline">
        Back to Home
      </Link>
    </div>
  );
}
