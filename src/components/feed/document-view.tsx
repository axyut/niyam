"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { components } from "@/lib/api-types";
import { ArrowLeft } from "lucide-react";

type Article = components["schemas"]["ArticleOutputBody"];
type DocumentContent = components["schemas"]["LegalDocumentContent"];

interface DocumentViewProps {
  article: Article;
  documentContent: DocumentContent;
}

export function DocumentView({ article, documentContent }: DocumentViewProps) {
  const [showBackButton, setShowBackButton] = useState(true);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let lastScrollY = container.scrollTop;
    const handleScroll = () => {
      if (container.scrollTop > lastScrollY && container.scrollTop > 100) {
        setShowBackButton(false);
      } else {
        setShowBackButton(true);
      }
      lastScrollY = container.scrollTop;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // FIX: The root element is now a flex container that fills the panel's height.
    <div className="h-full flex flex-col relative">
      {/* The back button is positioned absolutely within this container */}
      <div
        className={`absolute top-4 left-1/2 -translate-x-1/2 z-10 transition-transform duration-300 ${
          showBackButton ? "translate-y-0" : "-translate-y-20"
        }`}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm border rounded-full shadow-md hover:bg-accent"
        >
          <ArrowLeft size={16} />
          Back to Feed
        </Link>
      </div>

      {/* FIX: This div is now the scrollable container */}
      <div
        ref={scrollContainerRef}
        className="flex-grow overflow-y-auto pt-20 p-6"
      >
        <article>
          <h1 className="text-4xl font-bold text-foreground">
            {article.title.en}
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            {article.summary.en}
          </p>
          <div className="border-b my-6"></div>
          <div className="prose dark:prose-invert max-w-none">
            {documentContent.sections?.map((section, index) => (
              <section key={section.section_id || index}>
                {section.heading && <h2>{section.heading}</h2>}
                {section.paragraphs?.map((p, pIndex) => (
                  <p key={p.paragraph_id || pIndex}>{p.original_text}</p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
