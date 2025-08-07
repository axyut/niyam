"use client";

import Image from "next/image";
import { components } from "@/lib/api-types";
import { Star, Briefcase, MapPin, Tag } from "lucide-react";
import { getSafeImageUrl } from "@/lib/utils"; // Import the new utility

type Professional = components["schemas"]["ProfessionalOutputBody"];

interface RightPanelProfessionalPreviewProps {
  professional: Professional;
}

export function RightPanelProfessionalPreview({
  professional,
}: RightPanelProfessionalPreviewProps) {
  // Use the safe URL getter
  const imageUrl = getSafeImageUrl(
    professional.profileImageUrl,
    `https://placehold.co/96x96/1a1a1a/ffffff/png?text=${professional.fullName.charAt(
      0
    )}`
  );

  return (
    <div className="h-full bg-secondary rounded-lg p-6 animate-fade-in-fast flex flex-col text-center">
      <div className="relative h-24 w-24 mx-auto">
        <Image
          src={imageUrl}
          alt={professional.fullName}
          fill
          className="rounded-full object-cover border-4 border-card"
        />
      </div>
      <h3 className="text-xl font-bold text-foreground mt-4">
        {professional.fullName}
      </h3>
      <p className="text-sm text-muted-foreground">
        {professional.profileTitle}
      </p>

      <div className="border-t my-4"></div>

      <div className="flex-grow space-y-4 text-sm text-left">
        <div className="flex items-center gap-3">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <span>{professional.currentPosition}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{professional.location}</span>
        </div>
        <div className="flex items-center gap-3">
          <Star className="h-4 w-4 text-muted-foreground" />
          <span>Rating: {professional.stats.rating.toFixed(1)}</span>
        </div>
        {professional.expertiseTags && (
          <div className="flex items-start gap-3">
            <Tag className="h-4 w-4 text-muted-foreground mt-1" />
            <div className="flex flex-wrap gap-2">
              {professional.expertiseTags.map((tag) => (
                <div
                  key={tag}
                  className="bg-background text-foreground text-xs font-semibold px-2 py-1 rounded"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
