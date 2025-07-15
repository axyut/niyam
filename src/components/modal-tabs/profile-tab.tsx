"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/lib/store";
import {
  LogIn,
  UserPlus,
  LogOut,
  Mail,
  MapPin,
  BookText,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "../ui/button";
import { apiClient } from "@/lib/api";
import { components } from "@/lib/api-types";

type UserType = components["schemas"]["UserOutputBody"];

export function ProfileTab() {
  const { user, setUser, setToken, openLogoutConfirm } = useAuthStore();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await apiClient.login({ identifier, password });
      if (response.token && response.user) {
        setToken(response.token);
        setUser(response.user.Body as UserType);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    // Safely format the date to avoid hydration errors.
    // new Date(user.createdAt).toISOString().split('T')[0] will reliably produce "YYYY-MM-DD"
    const memberSince = new Date(user.createdAt).toISOString().split("T")[0];

    return (
      <div className="p-8 animate-fade-in space-y-6">
        <div className="flex items-center gap-6">
          {/* <Image
            src={
              user.imageUrl ||
              `https://placehold.co/96x96/1a1a1a/ffffff/png?text=${user.username
                .charAt(0)
                .toUpperCase()}`
            }
            alt="User profile picture"
            width={96}
            height={96}
            className="rounded-full border-4 border-primary/50"
          /> */}
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-secondary-foreground">
            {user ? user.username.charAt(0).toUpperCase() : <User size={16} />}
          </div>
          <div className="flex-grow">
            <h3 className="text-2xl font-bold">
              {user.firstName || user.username}
            </h3>
            <p className="text-muted-foreground">{user.role}</p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          {user.bio && (
            <div className="flex items-start gap-3">
              <BookText className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
              <p className="text-foreground">{user.bio}</p>
            </div>
          )}
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
            <p className="text-foreground">{user.email}</p>
          </div>
          {user.address && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
              <p className="text-foreground">{user.address}</p>
            </div>
          )}
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
            <p className="text-foreground">Member since {memberSince}</p>
          </div>
        </div>

        <div className="pt-6 border-t">
          <Button
            onClick={openLogoutConfirm}
            variant="outline"
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
    );
  }

  // Login/Signup Form
  return (
    <div className="p-8 animate-fade-in">
      <h3 className="text-2xl font-bold text-center mb-6">
        Access Your Account
      </h3>
      <form onSubmit={handleLogin} className="space-y-4">
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
        {error && (
          <p className="text-sm text-destructive text-center pt-2">{error}</p>
        )}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            <LogIn className="mr-2 h-4 w-4" />{" "}
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            <UserPlus className="mr-2 h-4 w-4" /> Sign Up
          </Button>
        </div>
      </form>
    </div>
  );
}
