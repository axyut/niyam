"use client";

import { Link } from "@/i18n/navigation";

export default function ProfessionalPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Professional User</h1>
      <p className="mb-4">proffessional user here</p>
      <Link href="/" className="text-primary hover:underline">
        &larr; Back to Home
      </Link>
    </div>
  );
}
