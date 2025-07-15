"use client";

import React, { useState } from "react";
import { useAuthStore, SessionUser } from "@/lib/store";
import { LogIn } from "lucide-react";
import { Button } from "../ui/button";
import { apiClient } from "@/lib/api";
import { components } from "@/lib/api-types";

// Raw API types
type ApiUser = components["schemas"]["UserOutputBody"];
type ApiAdmin = components["schemas"]["AdminOutputBody"];

// --- NORMALIZER FUNCTIONS ---
// These functions now include all fields for the SessionUser type.

function normalizeUser(user: ApiUser): SessionUser {
  return {
    id: user.id,
    displayName: user.firstName || user.username,
    email: user.email,
    role: user.role,
    imageUrl: user.imageUrl,
    bio: user.bio,
    address: user.address,
    createdAt: user.createdAt,
  };
}

function normalizeAdmin(admin: ApiAdmin): SessionUser {
  return {
    id: admin.id,
    displayName: admin.firstName || admin.adminname,
    email: admin.email,
    role: admin.role,
    imageUrl: admin.imageUrl,
    bio: admin.bio,
    address: admin.address,
    createdAt: admin.createdAt,
  };
}

export function LoginForm() {
  const { setUser, setToken } = useAuthStore();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (isAdminLogin) {
        const response = await apiClient.adminLogin({ identifier, password });
        if (response.token && response.admin) {
          setToken(response.token);
          const sessionUser = normalizeAdmin(response.admin.Body as ApiAdmin);
          setUser(sessionUser);
        }
      } else {
        const response = await apiClient.login({ identifier, password });
        if (response.token && response.user) {
          setToken(response.token);
          const sessionUser = normalizeUser(response.user.Body as ApiUser);
          setUser(sessionUser);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
      <div>
        <label className="text-sm font-medium text-muted-foreground">
          Email or Username
        </label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full mt-1 p-3 bg-secondary border-border rounded-md focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium text-muted-foreground">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1 p-3 bg-secondary border-border rounded-md focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="admin-login-checkbox"
            checked={isAdminLogin}
            onChange={(e) => setIsAdminLogin(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label
            htmlFor="admin-login-checkbox"
            className="text-sm text-muted-foreground"
          >
            Sign in as Administrator
          </label>
        </div>
        <Button type="submit" size="lg" disabled={isLoading}>
          <LogIn className="mr-2 h-4 w-4" />{" "}
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-destructive text-center pt-2">{error}</p>
      )}
    </form>
  );
}
