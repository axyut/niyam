"use client";

import Image from "next/image";
import { components } from "@/lib/api-types";
import { Star, MapPin, Tag, ShieldCheck } from "lucide-react";
import { getSafeImageUrl } from "@/lib/utils";

type Professional = components["schemas"]["ProfessionalOutputBody"];

interface ProfessionalDetailViewProps {
  professional: Professional;
}

export function ProfessionalDetailView({
  professional,
}: ProfessionalDetailViewProps) {
  const imageUrl = getSafeImageUrl(
    professional.profileImageUrl,
    `https://placehold.co/128x128/1a1a1a/ffffff/png?text=${professional.fullName.charAt(
      0
    )}`
  );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Profile Picture and Verification */}
        <div className="relative h-32 w-32 shrink-0">
          <Image
            src={imageUrl}
            alt={professional.fullName}
            fill
            className="rounded-full object-cover border-4 border-primary"
          />
          {professional.isVerified && (
            <div className="absolute bottom-1 right-1 bg-green-500 p-1.5 rounded-full border-2 border-card">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        {/* Main Info */}
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-4xl font-bold">{professional.fullName}</h1>
          <p className="text-xl text-primary font-semibold mt-1">
            {professional.profileTitle}
          </p>
          <p className="text-muted-foreground mt-2">
            {professional.currentPosition}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} /> {professional.location}
            </div>
            <div className="flex items-center gap-1.5">
              <Star size={14} /> Rating: {professional.stats.rating.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t my-8"></div>

      {/* Bio and Expertise */}
      <div className="space-y-6">
        {professional.bio && (
          <div>
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-foreground/80">{professional.bio}</p>
          </div>
        )}
        {professional.expertiseTags &&
          professional.expertiseTags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {professional.expertiseTags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1.5 bg-secondary text-secondary-foreground text-sm font-medium px-3 py-1 rounded-full"
                  >
                    <Tag size={14} />
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
