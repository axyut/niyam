"use client";

import React, { useState } from "react";
import { useAuthStore, SessionUser } from "@/lib/store";
import { UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { apiClient } from "@/lib/api";
import { components } from "@/lib/api-types";

type ApiUser = components["schemas"]["UserOutputBody"];

// Normalizer function to convert the raw API user into our clean SessionUser
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

export function SignupForm() {
  const { setUser, setToken } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await apiClient.signup(formData);
      if (response.token && response.user) {
        setToken(response.token);
        const sessionUser = normalizeUser(response.user.Body as ApiUser);
        setUser(sessionUser);
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
    <form onSubmit={handleSignup} className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
          className="w-full p-3 bg-secondary border-border rounded-md focus:ring-2 focus:ring-ring"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          onChange={handleChange}
          className="w-full p-3 bg-secondary border-border rounded-md focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={handleChange}
        className="w-full p-3 bg-secondary border-border rounded-md focus:ring-2 focus:ring-ring"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        onChange={handleChange}
        className="w-full p-3 bg-secondary border-border rounded-md focus:ring-2 focus:ring-ring"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        className="w-full p-3 bg-secondary border-border rounded-md focus:ring-2 focus:ring-ring"
        required
      />

      {error && (
        <p className="text-sm text-destructive text-center pt-2">{error}</p>
      )}

      <div className="pt-2">
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          <UserPlus className="mr-2 h-4 w-4" />{" "}
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </div>
    </form>
  );
}
