"use client";

import React, { useState } from "react";
import { useAuthStore, ApiUser } from "@/lib/store";
import { UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

// This component remains self-contained and doesn't need a normalizer
// as it only deals with the ApiUser type from the signup response.

export function SignupForm() {
  const { setUser, setToken } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiClient.signup(formData);
      if (response.token && response.user) {
        setToken(response.token);
        const newUser = response.user.Body as ApiUser;
        setUser(newUser);
        toast.success(`Account created successfully!`, {
          description: `Welcome to Niyam, ${
            newUser.firstName || newUser.username
          }!`,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      toast.error("Signup Failed", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      <div className="pt-2">
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          <UserPlus className="mr-2 h-4 w-4" />{" "}
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </div>
    </form>
  );
}
