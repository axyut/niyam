"use client";

import React, { useEffect } from "react";
import { useAuthStore, AuthState } from "@/lib/store";
import { X, User, Settings, Info, Bell } from "lucide-react";
import { NiyamInfoTab } from "../modal-tabs/niyam-info-tab";
import { AccountTab } from "../modal-tabs/account-tab"; // FIX: Import new component
import { SettingsTab } from "../modal-tabs/settings-tab";
import { NotificationsTab } from "../modal-tabs/notifications-tab";

export function SettingsModal() {
  const {
    isSettingsModalOpen,
    closeSettingsModal,
    activeSettingsTab,
    setActiveSettingsTab,
  } = useAuthStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSettingsModal();
    };
    if (isSettingsModalOpen)
      document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSettingsModalOpen, closeSettingsModal]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeSettingsModal();
  };

  if (!isSettingsModalOpen) return null;

  const tabs: {
    id: AuthState["activeSettingsTab"];
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: "niyam", label: "Niyam", icon: Info },
    { id: "account", label: "Account", icon: User }, // FIX: Renamed 'Profile' to 'Account'
    { id: "settings", label: "Settings", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const renderContent = () => {
    switch (activeSettingsTab) {
      case "niyam":
        return <NiyamInfoTab />;
      case "account":
        return <AccountTab />; // FIX: Render AccountTab
      case "settings":
        return <SettingsTab />;
      case "notifications":
        return <NotificationsTab />;
      default:
        return <AccountTab />;
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in-fast p-4"
    >
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-md md:max-w-2xl h-[550px] max-h-[90vh] md:h-[600px] flex flex-col relative">
        <button
          onClick={closeSettingsModal}
          className="absolute top-3 right-3 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent z-10"
        >
          <X size={20} />
        </button>
        <div className="border-b shrink-0">
          <div className="flex space-x-1 p-2 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSettingsTab(tab.id)}
                className={`flex items-center shrink-0 gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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
