import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { components } from "./api-types";

export type ApiUser = components["schemas"]["UserOutputBody"];
export type ApiAdmin = components["schemas"]["AdminOutputBody"];

// --- UI STORE ---
interface UIState {
  isSidebarOpen: boolean;
  controlsPosition: "top" | "bottom";
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setControlsPosition: (position: "top" | "bottom") => void;
}
type PersistedUIState = Pick<UIState, "isSidebarOpen" | "controlsPosition">;
export const useUIStore = create(
  persist<UIState, [], [], PersistedUIState>(
    (set) => ({
      isSidebarOpen: true,
      controlsPosition: "bottom",
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      setControlsPosition: (position) => set({ controlsPosition: position }),
    }),
    {
      name: "niyam-ui-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isSidebarOpen: state.isSidebarOpen,
        controlsPosition: state.controlsPosition,
      }),
    }
  )
);

// --- AUTH & CONTEXT STORE ---
export interface AuthState {
  user: (ApiUser | ApiAdmin) | null;
  token: string | null;
  isSettingsModalOpen: boolean;
  activeSettingsTab: "niyam" | "account" | "settings" | "notifications";
  isLogoutConfirmOpen: boolean;

  // --- CONTEXT STATE ---
  activeArticle: { id: string; title: string } | null;
  activeContextualTab: "discuss" | "references" | "ai" | "info";
  hoveredArticleId: string | null; // NEW: To track hovered article for previews

  // --- ACTIONS ---
  setUser: (user: (ApiUser | ApiAdmin) | null) => void;
  setToken: (token: string | null) => void;
  openSettingsModal: (tab?: AuthState["activeSettingsTab"]) => void;
  closeSettingsModal: () => void;
  setActiveSettingsTab: (tab: AuthState["activeSettingsTab"]) => void;
  openLogoutConfirm: () => void;
  closeLogoutConfirm: () => void;
  logout: () => void;

  // --- CONTEXT ACTIONS ---
  setActiveArticle: (article: { id: string; title: string } | null) => void;
  setActiveContextualTab: (tab: AuthState["activeContextualTab"]) => void;
  setHoveredArticleId: (id: string | null) => void; // NEW: Action for hover state
}

type PersistedAuthState = Pick<AuthState, "token" | "user">;

export const useAuthStore = create(
  persist<AuthState, [], [], PersistedAuthState>(
    (set) => ({
      user: null,
      token: null,
      isSettingsModalOpen: false,
      activeSettingsTab: "account",
      isLogoutConfirmOpen: false,
      activeArticle: null,
      activeContextualTab: "discuss",
      hoveredArticleId: null, // Initial state

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      openSettingsModal: (tab = "account") =>
        set({ isSettingsModalOpen: true, activeSettingsTab: tab }),
      closeSettingsModal: () => set({ isSettingsModalOpen: false }),
      setActiveSettingsTab: (tab) => set({ activeSettingsTab: tab }),
      openLogoutConfirm: () => set({ isLogoutConfirmOpen: true }),
      closeLogoutConfirm: () => set({ isLogoutConfirmOpen: false }),
      logout: () =>
        set({
          user: null,
          token: null,
          isLogoutConfirmOpen: false,
          activeArticle: null,
        }),

      setActiveArticle: (article) =>
        set({ activeArticle: article, activeContextualTab: "discuss" }),
      setActiveContextualTab: (tab) => set({ activeContextualTab: tab }),
      setHoveredArticleId: (id) => set({ hoveredArticleId: id }), // New action implementation
    }),
    {
      name: "niyam-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
