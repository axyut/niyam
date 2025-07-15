import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { components } from "./api-types";

type User = components["schemas"]["UserOutputBody"];

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

// --- AUTH STORE ---
export interface AuthState {
  // Exporting the interface
  user: User | null;
  token: string | null;
  isSettingsModalOpen: boolean;
  activeSettingsTab: "niyam" | "profile" | "settings";
  isLogoutConfirmOpen: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  openSettingsModal: (tab?: AuthState["activeSettingsTab"]) => void;
  closeSettingsModal: () => void;
  setActiveSettingsTab: (tab: AuthState["activeSettingsTab"]) => void;
  openLogoutConfirm: () => void;
  closeLogoutConfirm: () => void;
  logout: () => void;
}

type PersistedAuthState = Pick<AuthState, "token">;

export const useAuthStore = create(
  persist<AuthState, [], [], PersistedAuthState>(
    (set) => ({
      user: null,
      token: null,
      isSettingsModalOpen: false,
      activeSettingsTab: "profile",
      isLogoutConfirmOpen: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      openSettingsModal: (tab = "profile") =>
        set({ isSettingsModalOpen: true, activeSettingsTab: tab }),
      closeSettingsModal: () => set({ isSettingsModalOpen: false }),
      setActiveSettingsTab: (tab) => set({ activeSettingsTab: tab }),
      openLogoutConfirm: () => set({ isLogoutConfirmOpen: true }),
      closeLogoutConfirm: () => set({ isLogoutConfirmOpen: false }),
      logout: () =>
        set({ user: null, token: null, isLogoutConfirmOpen: false }),
    }),
    {
      name: "niyam-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }),
    }
  )
);
