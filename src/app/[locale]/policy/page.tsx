"use client";

import { Link } from "@/i18n/navigation";

export default function PolicyPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Policy Page</h1>
      <p className="mb-4">
        This is where the community policy information will be displayed. Please
        refer to our guidelines and rules for participation in the community.
      </p>
      <Link href="/" className="text-primary hover:underline">
        &larr; Back to Home
      </Link>
    </div>
  );
}
