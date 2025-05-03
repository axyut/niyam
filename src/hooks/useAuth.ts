"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserData, LoginCredentials, RegisterData } from "@/types";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (data.success && data.data?.user) {
          setUser(data.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
        console.error("Auth check error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success && data.data?.user) {
        setUser(data.data.user);
        router.push("/dashboard");
        return true;
      } else {
        setError(data.error || "Login failed");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (registerData: RegisterData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (data.success && data.data?.user) {
        setUser(data.data.user);
        router.push("/dashboard");
        return true;
      } else {
        setError(data.error || "Registration failed");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setUser(null);
        router.push("/login");
        return true;
      } else {
        setError(data.error || "Logout failed");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during logout");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };
}
