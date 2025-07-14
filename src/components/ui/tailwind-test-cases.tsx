"use client";

import { useTranslations } from "next-intl";
import { Button } from "./button";

export function TailwindTestCases() {
  const t = useTranslations("LawsPage"); // Assuming you might want a title from your translations

  return (
    <div className="space-y-12">
      {/* Section 1: Typography and Basic Colors */}
      <section>
        <h2 className="text-2xl font-bold border-b pb-2 mb-4 text-primary">
          1. Typography & Colors
        </h2>
        <div className="space-y-4 text-foreground">
          <h1>H1 Heading: The quick brown fox jumps over the lazy dog</h1>
          <h2>H2 Heading: The quick brown fox jumps over the lazy dog</h2>
          <h3>H3 Heading: The quick brown fox jumps over the lazy dog</h3>
          <h4>H4 Heading: The quick brown fox jumps over the lazy dog</h4>
          <h5>H5 Heading: The quick brown fox jumps over the lazy dog</h5>
          <h6>H6 Heading: The quick brown fox jumps over the lazy dog</h6>
          <p>
            This is a paragraph of text using `text-foreground`. It should be
            nearly black in light mode and nearly white in dark mode. The
            background of this page uses `bg-background`.
          </p>
          <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground">
            "This is a blockquote. It should have a distinct accent color on the
            left border and muted text."
          </blockquote>
        </div>
      </section>

      {/* Section 2: Interactive Elements & States */}
      <section>
        <h2 className="text-2xl font-bold border-b pb-2 mb-4 text-primary">
          2. Interactive Elements
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button>Default Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link Button</Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Test: Hover over the buttons above. They should change background
          color. Click on them to see the focus ring (`ring-ring`).
        </p>
      </section>

      {/* Section 3: Containers and Borders */}
      <section>
        <h2 className="text-2xl font-bold border-b pb-2 mb-4 text-primary">
          3. Containers & Borders
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-md">
            <h4 className="font-semibold mb-2">Standard Card</h4>
            <p className="text-sm">
              This card uses `bg-card`, `text-card-foreground`, and
              `border-border`. It has a `rounded-lg` radius.
            </p>
          </div>
          <div className="bg-secondary text-secondary-foreground p-6 rounded-xl border-2 border-primary/50 shadow-lg">
            <h4 className="font-semibold mb-2">Secondary Background Card</h4>
            <p className="text-sm">
              This card uses `bg-secondary` and has a more pronounced
              `rounded-xl` radius and a primary border color.
            </p>
          </div>
          <div className="bg-accent text-accent-foreground p-6 rounded-full text-center">
            <p>A fully rounded `div` using `bg-accent`.</p>
          </div>
          <div className="bg-destructive text-destructive-foreground p-6 rounded-md">
            <p>A `div` with `bg-destructive` for alerts.</p>
          </div>
        </div>
      </section>

      {/* Section 4: Dark Mode Direct Test */}
      <section>
        <h2 className="text-2xl font-bold border-b pb-2 mb-4 text-primary">
          4. Manual Dark Mode Test
        </h2>
        <div className="p-6 rounded-lg border bg-slate-100 dark:bg-slate-800">
          <h4 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
            Specific Override Card
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            This card explicitly uses `dark:` prefixes (e.g.,
            `dark:bg-slate-800`). This demonstrates that you can override the
            theme variables when needed.
          </p>
        </div>
      </section>
    </div>
  );
}
