"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { LogOut, AlertTriangle } from "lucide-react";
import { Button } from "./button";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

export function LogoutConfirmation() {
  const { isLogoutConfirmOpen, closeLogoutConfirm, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await apiClient.logout();
      logout();
      toast.info("You have been successfully logged out.");
    } catch (err) {
      // Still log out on the client even if the API fails
      console.error("Logout failed:", err);
      logout();
      toast.error(
        "Logout failed on server, but you have been logged out locally."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLogoutConfirmOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in-fast p-4">
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 mb-4">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Are you sure?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You will be logged out of your account.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={closeLogoutConfirm}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? (
              "Logging out..."
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
