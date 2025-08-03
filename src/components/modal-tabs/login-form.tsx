"use client";

import React, { useState } from "react";
import { useAuthStore, ApiUser, ApiAdmin } from "@/lib/store";
import { LogIn } from "lucide-react";
import { Button } from "../ui/button";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

export function LoginForm() {
  const { setUser, setToken } = useAuthStore();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let displayName = "";
      if (isAdminLogin) {
        const response = await apiClient.adminLogin({ identifier, password });
        const admin = response.admin.Body as ApiAdmin;
        setToken(response.token);
        setUser(admin);
        displayName = admin.firstName || admin.adminname;
      } else {
        const response = await apiClient.login({ identifier, password });
        const user = response.user.Body as ApiUser;
        setToken(response.token);
        setUser(user);
        displayName = user.firstName || user.username;
      }
      toast.success(`Welcome back, ${displayName}!`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      toast.error("Login Failed", { description: errorMessage });
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
    </form>
  );
}
