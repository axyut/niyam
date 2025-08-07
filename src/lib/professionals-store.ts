import { create } from "zustand";

// This store will manage the UI state for the /profiles page
interface ProfessionalsState {
  hoveredProfessionalId: string | null;
  setHoveredProfessionalId: (id: string | null) => void;
}

export const useProfessionalsStore = create<ProfessionalsState>((set) => ({
  hoveredProfessionalId: null,
  setHoveredProfessionalId: (id) => set({ hoveredProfessionalId: id }),
}));
