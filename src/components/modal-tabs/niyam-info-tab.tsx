"use client";

import Image from "next/image";

export function NiyamInfoTab() {
  return (
    <div className="p-8 text-center animate-fade-in">
      <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
        {/* <Info className="w-12 h-12 text-primary" /> */}
        <Image
          src="/logo.png"
          alt="Niyam Logo"
          width={32}
          height={32}
          className="rounded-md dark:bg-secondary-foreground"
        />
      </div>
      <h3 className="text-2xl font-bold mb-2 text-foreground">
        What is Niyam?
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        Niyam is an open-source platform designed to make Nepali laws
        accessible, navigable, and understandable for everyone, from legal
        professionals to ordinary citizens.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        <div className="bg-secondary p-4 rounded-lg">
          <h4 className="font-semibold">Legislative History</h4>
          <p className="text-sm text-muted-foreground">
            Track changes and understand the context behind laws.
          </p>
        </div>
        <div className="bg-secondary p-4 rounded-lg">
          <h4 className="font-semibold">Community Driven</h4>
          <p className="text-sm text-muted-foreground">
            Engage in discussions and contribute to legal transparency.
          </p>
        </div>
      </div>
    </div>
  );
}
