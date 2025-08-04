"use client";

import { useEffect } from "react";
import { redirect, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

// This component's only job is to redirect to the default 'discuss' tab.
export default function ArticleRedirectPage() {
  const params = useParams<{ slug: string }>();

  useEffect(() => {
    if (params.slug) {
      redirect(`/article/${params.slug}/discuss`);
    }
  }, [params.slug]);

  // Show a loading spinner while the redirect is happening
  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
