"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { LogOut, AlertTriangle } from "lucide-react";
import { Button } from "./button";
import { apiClient } from "@/lib/api";

export function LogoutConfirmation() {
  const { isLogoutConfirmOpen, closeLogoutConfirm, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Call the API endpoint to invalidate the session on the server
      await apiClient.logout();
      // If the API call is successful, clear the client-side state
      logout();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Logout failed. Please try again."
      );
      // Even if API fails, we can still log the user out on the client
      logout();
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
          You will be logged out of your account and will need to sign in again
          to access your data.
        </p>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
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
