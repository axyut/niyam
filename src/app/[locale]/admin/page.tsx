"use client";

import { Link } from "@/i18n/navigation";

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Page</h1>
      <p className="mb-4">
        visible to admin and superadmin This page will display analytics and
        statistics related to the platform's usage, user engagement, and other
        relevant metrics.
      </p>
      <Link href="/" className="text-primary hover:underline">
        Back to Home
      </Link>
    </div>
  );
}
