"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return <>Loading...</>;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <button onClick={handleLogout}>Logout</button>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard!</p>
        Welcome, {user}
      </div>
    </>
  );
}
