"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import { components } from "@/lib/api-types";
import { ProfessionalDetailView } from "@/components/professionals/professional-detail-view";
import { Loader2 } from "lucide-react";

type Professional = components["schemas"]["ProfessionalOutputBody"];

export default function SelectedProfilePage() {
  const params = useParams<{ id: string }>();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessional = async () => {
      const id = params.id as string;
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await apiClient.getProfessionalById(id);
        setProfessional(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load profile."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessional();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !professional) {
    return (
      <div className="flex items-center justify-center h-full text-destructive bg-destructive/10 p-4 rounded-md">
        {error || "Profile could not be loaded."}
      </div>
    );
  }

  return (
    // This page will have a single column layout for now to focus on the profile
    <div className="bg-card border rounded-lg h-[calc(100vh-8rem)] overflow-y-auto">
      <ProfessionalDetailView professional={professional} />
    </div>
  );
}
