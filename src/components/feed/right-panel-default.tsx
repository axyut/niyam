"use client";

import Image from "next/image";

export function RightPanelDefault() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-secondary rounded-lg">
      <Image
        src="/logo.png"
        alt="Niyam Logo"
        width={64}
        height={64}
        className="rounded-lg mb-4"
      />
      <h3 className="text-xl font-bold text-foreground">Welcome to Niyam</h3>
      <p className="text-muted-foreground max-w-xs mt-2">
        Hover over an article to see a preview, or click on one to read the full
        document and join the discussion.
      </p>
    </div>
  );
}
