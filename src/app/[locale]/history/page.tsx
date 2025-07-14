"use client";

import { Link } from "@/i18n/navigation";

export default function HistoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">History</h1>
      <p className="mb-4">
        This page will display the history of changes, updates, and significant
        events related to the platform. It will include a timeline of key
        milestones and modifications made over time.
      </p>
      <Link href="/" className="text-primary hover:underline">
        &larr; Back to Home
      </Link>
    </div>
  );
}
