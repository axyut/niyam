"use client";

import React, { useEffect } from "react";
import { useAuthStore, AuthState } from "@/lib/store";
import { X, User, Settings, Info } from "lucide-react";
import { NiyamInfoTab } from "../modal-tabs/niyam-info-tab";
import { ProfileTab } from "../modal-tabs/profile-tab";
import { SettingsTab } from "../modal-tabs/settings-tab";

export function SettingsModal() {
  const {
    isSettingsModalOpen,
    closeSettingsModal,
    activeSettingsTab,
    setActiveSettingsTab,
  } = useAuthStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSettingsModal();
      }
    };

    if (isSettingsModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSettingsModalOpen, closeSettingsModal]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeSettingsModal();
    }
  };

  if (!isSettingsModalOpen) return null;

  // This array is now strictly typed using the AuthState interface.
  // This ensures any `id` must be 'niyam', 'profile', or 'settings'.
  const tabs: {
    id: AuthState["activeSettingsTab"];
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: "niyam", label: "Niyam", icon: Info },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeSettingsTab) {
      case "niyam":
        return <NiyamInfoTab />;
      case "profile":
        return <ProfileTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in-fast p-4"
    >
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-2xl h-[600px] flex flex-col relative">
        <button
          onClick={closeSettingsModal}
          className="absolute top-3 right-3 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent z-10"
        >
          <X size={20} />
        </button>
        <div className="border-b shrink-0">
          <div className="flex space-x-1 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                // Because `tabs` is now strongly typed, no type assertion is needed here.
                onClick={() => setActiveSettingsTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSettingsTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">{renderContent()}</div>
      </div>
    </div>
  );
}
