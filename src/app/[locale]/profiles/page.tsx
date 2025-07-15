"use client";

import { Link } from "@/i18n/navigation";

export default function ProfilesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Profiles Page</h1>
      <p className="mb-4">Profiles of all the policy makers and politicians</p>
      <Link href="/" className="text-primary hover:underline">
        &larr; Back to Home
      </Link>
    </div>
  );
}
