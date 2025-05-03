"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const { login, loading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Please fill in all fields");
      return;
    }

    const success = await login({ email, password });
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="w-full max-w-md px-6 py-4 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {formError && (
              <div className="text-red-500 text-sm">{formError}</div>
            )}
            <InputFields
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 bg-blue-600 text-white rounded-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
          <div className="mt-4 text-center">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600">
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function InputFields({
  email,
  setEmail,
  password,
  setPassword,
}: {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}) {
  return (
    <>
      {/* Email address */}
      Email address
      <input
        id="email-address"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder="Email address"
      />
      Password
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder="Password"
      />
    </>
  );
}
