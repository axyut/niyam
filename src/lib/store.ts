import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { components } from "./api-types";

// The raw API response types
export type ApiUser = components["schemas"]["UserOutputBody"];
export type ApiAdmin = components["schemas"]["AdminOutputBody"];

// The UNIFIED, NORMALIZED user type for our frontend UI
export interface SessionUser {
  id: string;
  displayName: string;
  email: string;
  role: string;
  imageUrl?: string;
  // Add other fields from the API that you want to display
  bio?: string;
  address?: string;
  createdAt: string;
}

// --- UI STORE (No changes) ---
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
  user: SessionUser | null;
  token: string | null;
  isSettingsModalOpen: boolean;
  activeSettingsTab: "niyam" | "account" | "settings" | "notifications";
  isLogoutConfirmOpen: boolean;
  setUser: (user: SessionUser | null) => void;
  setToken: (token: string | null) => void;
  openSettingsModal: (tab?: AuthState["activeSettingsTab"]) => void;
  closeSettingsModal: () => void;
  setActiveSettingsTab: (tab: AuthState["activeSettingsTab"]) => void;
  openLogoutConfirm: () => void;
  closeLogoutConfirm: () => void;
  logout: () => void;
}

// FIX: The persisted state now includes both the token AND the user object.
type PersistedAuthState = Pick<AuthState, "token" | "user">;

export const useAuthStore = create(
  persist<AuthState, [], [], PersistedAuthState>(
    (set) => ({
      user: null,
      token: null,
      isSettingsModalOpen: false,
      activeSettingsTab: "account",
      isLogoutConfirmOpen: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      openSettingsModal: (tab = "account") =>
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
      // The partialize function now saves both token and user.
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
