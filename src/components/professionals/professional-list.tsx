"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useProfessionalsStore } from "@/lib/professionals-store";
import { apiClient } from "@/lib/api";
import { components } from "@/lib/api-types";
import { Link } from "@/i18n/navigation";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { getSafeImageUrl } from "@/lib/utils"; // Import the new utility

type Professional = components["schemas"]["ProfessionalOutputBody"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const ProfessionalListItem = ({
  professional,
}: {
  professional: Professional;
}) => {
  const { setHoveredProfessionalId } = useProfessionalsStore();

  // Use the safe URL getter
  const imageUrl = getSafeImageUrl(
    professional.profileImageUrl,
    `https://placehold.co/48x48/1a1a1a/ffffff/png?text=${professional.fullName.charAt(
      0
    )}`
  );

  return (
    <motion.li variants={itemVariants}>
      <Link
        href={`/profiles/${professional.id}`}
        onMouseEnter={() => setHoveredProfessionalId(professional.id)}
        className="block p-4 rounded-lg hover:bg-secondary transition-all duration-200"
      >
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 shrink-0">
            <Image
              src={imageUrl}
              alt={professional.fullName}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-foreground">
              {professional.fullName}
            </h4>
            <p className="text-sm text-muted-foreground">
              {professional.profileTitle}
            </p>
          </div>
        </div>
      </Link>
    </motion.li>
  );
};

export function ProfessionalList() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setHoveredProfessionalId } = useProfessionalsStore();

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await apiClient.getAllProfessionals();
        setProfessionals(response.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfessionals();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b shrink-0">
        <h2 className="text-2xl font-bold">Professionals</h2>
      </div>
      <div
        className="flex-grow overflow-y-auto"
        onMouseLeave={() => setHoveredProfessionalId(null)}
      >
        <motion.ul
          className="space-y-1 p-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {professionals.map((prof) => (
            <ProfessionalListItem key={prof.id} professional={prof} />
          ))}
        </motion.ul>
      </div>
    </div>
  );
}
