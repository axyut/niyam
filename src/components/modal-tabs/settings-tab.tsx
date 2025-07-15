"use client";

import { useUIStore } from "@/lib/store";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "../ui/button";

export function SettingsTab() {
  const { controlsPosition, setControlsPosition } = useUIStore();

  return (
    <div className="p-8 animate-fade-in space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4">Application Settings</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
            <label className="font-medium">Enable Notifications</label>
            <div className="w-12 h-7 bg-muted rounded-full relative cursor-pointer p-1">
              <div className="w-5 h-5 bg-card rounded-full transition-transform transform"></div>
            </div>
          </div>
          <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
            <label className="font-medium">Data Sync</label>
            <Button size="sm" variant="outline">
              Sync Now
            </Button>
          </div>
        </div>
      </div>
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-2">Layout Preferences</h3>
        <div className="p-2 bg-secondary rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            Sidebar controls position
          </p>
          <div className="flex gap-2">
            <Button
              variant={controlsPosition === "top" ? "default" : "outline"}
              onClick={() => setControlsPosition("top")}
              className="w-full"
            >
              <ArrowUp className="mr-2 h-4 w-4" /> Top
            </Button>
            <Button
              variant={controlsPosition === "bottom" ? "default" : "outline"}
              onClick={() => setControlsPosition("bottom")}
              className="w-full"
            >
              <ArrowDown className="mr-2 h-4 w-4" /> Bottom
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
