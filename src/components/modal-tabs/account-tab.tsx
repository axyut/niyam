"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuthStore } from "@/lib/store";
import {
  LogOut,
  Edit,
  Save,
  MapPin,
  BookText,
  Calendar,
  Shield,
} from "lucide-react";
import { Button } from "../ui/button";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";

// A reusable component for displaying a profile detail row
const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
}) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4">
      <Icon className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
};

// The main Account Tab component
export function AccountTab() {
  const { user, openLogoutConfirm } = useAuthStore();

  // --- HOOKS FIX ---
  // All hooks are now called unconditionally at the top level.
  const [isEditing, setIsEditing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    address: "",
  });

  // Effect to update form data when the user logs in or data changes
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        bio: user.bio || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Saving data:", formData);
    setIsEditing(false);
  };

  // --- RENDER LOGIC ---
  // The conditional logic now only decides which JSX to return.
  if (user) {
    return (
      <div className="p-8 animate-fade-in space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Image
              src={
                user.imageUrl ||
                `https://placehold.co/96x96/1a1a1a/ffffff/png?text=${user.displayName
                  .charAt(0)
                  .toUpperCase()}`
              }
              alt="User profile picture"
              width={96}
              height={96}
              className="rounded-full border-4 border-primary/50"
            />
            <div>
              <h3 className="text-2xl font-bold">{user.displayName}</h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <Save className="h-5 w-5" />
            ) : (
              <Edit className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Details Section (View or Edit mode) */}
        <div className="space-y-4 pt-6 border-t">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Display Name
                </label>
                <input
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 bg-secondary border-border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 bg-secondary border-border rounded-md min-h-[80px]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Address
                </label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 bg-secondary border-border rounded-md"
                />
              </div>
            </div>
          ) : (
            <>
              <DetailRow icon={BookText} label="Bio" value={user.bio} />
              <DetailRow icon={MapPin} label="Address" value={user.address} />
              <DetailRow icon={Shield} label="Role" value={user.role} />
              <DetailRow
                icon={Calendar}
                label="Member Since"
                value={
                  user.createdAt
                    ? new Date(user.createdAt).toISOString().split("T")[0]
                    : "Not available"
                }
              />
            </>
          )}
        </div>

        {/* Footer Section */}
        <div className="pt-6 border-t flex gap-4">
          {isEditing ? (
            <Button onClick={handleSave} className="w-full">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          ) : (
            <Button
              onClick={openLogoutConfirm}
              variant="destructive"
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Login/Signup Form
  return (
    <div className="p-8 animate-fade-in">
      <div className="flex justify-center mb-6 border-b">
        <button
          onClick={() => setActiveSubTab("login")}
          className={`px-6 py-3 text-lg font-semibold border-b-2 ${
            activeSubTab === "login"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground"
          }`}
        >
          Access Account
        </button>
        <button
          onClick={() => setActiveSubTab("signup")}
          className={`px-6 py-3 text-lg font-semibold border-b-2 ${
            activeSubTab === "signup"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground"
          }`}
        >
          Create Account
        </button>
      </div>
      {activeSubTab === "login" ? <LoginForm /> : <SignupForm />}
    </div>
  );
}
