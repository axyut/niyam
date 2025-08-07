import { create } from "zustand";

// This store will manage the UI state for the /docs page
interface DocsState {
  // This will hold the ID of the document the user is currently hovering over
  hoveredDocumentId: string | null;

  // Action to update the hovered document ID
  setHoveredDocumentId: (id: string | null) => void;
}

export const useDocsStore = create<DocsState>((set) => ({
  hoveredDocumentId: null,
  setHoveredDocumentId: (id) => set({ hoveredDocumentId: id }),
}));
