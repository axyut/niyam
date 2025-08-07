"use client";

import { useEffect, useState } from "react";
import { useProfessionalsStore } from "@/lib/professionals-store";
import { ProfessionalList } from "@/components/professionals/professional-list";
import { RightPanelDefault } from "@/components/feed/right-panel-default";
import { RightPanelProfessionalPreview } from "@/components/professionals/right-panel-professional-preview";
import { apiClient } from "@/lib/api";
import { components } from "@/lib/api-types";
import { motion, AnimatePresence } from "framer-motion";

type Professional = components["schemas"]["ProfessionalOutputBody"];

export default function ProfilesPage() {
  const { hoveredProfessionalId } = useProfessionalsStore();
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  const hoveredProfessional = professionals.find(
    (p) => p.id === hoveredProfessionalId
  );

  useEffect(() => {
    apiClient.getAllProfessionals().then((res) => {
      setProfessionals(res.data || []);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
      <div className="bg-card border rounded-lg h-full overflow-hidden">
        <ProfessionalList />
      </div>
      <div className="hidden md:block h-full overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={hoveredProfessional ? hoveredProfessional.id : "default"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            {hoveredProfessional ? (
              <RightPanelProfessionalPreview
                professional={hoveredProfessional}
              />
            ) : (
              <RightPanelDefault />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
