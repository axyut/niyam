"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as NextLink } from "@/i18n/navigation";
import { components } from "@/lib/api-types";
import { ArrowLeft, List } from "lucide-react";

type LegalDocument = components["schemas"]["LegalDocument"];
type DocumentContent = components["schemas"]["LegalDocumentContent"];

interface StructuredDocumentViewProps {
  document: LegalDocument;
  content: DocumentContent;
}

// Table of Contents Component
const TableOfContents = ({ content }: { content: DocumentContent }) => {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Create an observer to watch for which section is in view
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" } // Highlight when section is at the top of the viewport
    );

    const sections = document.querySelectorAll("h1[id], h2[id]");
    sections.forEach((section) => observer.current?.observe(section));

    return () => {
      sections.forEach((section) => {
        console.log(section);
        observer.current?.disconnect();
      });
    };
  }, [content]);

  return (
    <aside className="sticky top-24 h-[calc(100vh-12rem)] overflow-y-auto p-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
        <List size={20} />
        Table of Contents
      </h3>
      <ul className="space-y-2">
        {content.chapters?.map((chapter, chapIndex) => (
          <li key={chapter.chapter_id || chapIndex}>
            {chapter.title && (
              <ScrollLink
                to={chapter.chapter_id || `chap-${chapIndex}`}
                spy={true}
                smooth={true}
                offset={-100}
                duration={500}
                className={`cursor-pointer font-bold block transition-colors ${
                  activeSectionId ===
                  (chapter.chapter_id || `chap-${chapIndex}`)
                    ? "text-primary"
                    : "hover:text-primary"
                }`}
              >
                {chapter.title}
              </ScrollLink>
            )}
            {chapter.sections && (
              <ul className="pl-4 mt-2 space-y-2 border-l">
                {chapter.sections.map((section, secIndex) => (
                  <li key={section.section_id || secIndex}>
                    {section.title && (
                      <ScrollLink
                        to={section.section_id || `sec-${secIndex}`}
                        spy={true}
                        smooth={true}
                        offset={-100}
                        duration={500}
                        className={`cursor-pointer text-sm block transition-colors ${
                          activeSectionId ===
                          (section.section_id || `sec-${secIndex}`)
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {section.title}
                      </ScrollLink>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export function StructuredDocumentView({
  document,
  content,
}: StructuredDocumentViewProps) {
  return (
    <div className="h-full flex flex-col relative">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <NextLink
          href="/docs"
          className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm border rounded-full shadow-md hover:bg-accent"
        >
          <ArrowLeft size={16} />
          Back to Documents
        </NextLink>
      </div>

      {/* Main container is now a grid with 3 columns */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden">
        {/* Document Content (takes 2 columns) */}
        <div className="md:col-span-2 h-full overflow-y-auto pt-20 p-6">
          <article>
            <h1 className="text-4xl font-bold text-foreground">
              {document.Title}
            </h1>
            {content.preamble && (
              <p className="text-lg text-muted-foreground mt-4 italic">
                {content.preamble}
              </p>
            )}
            <div className="border-b my-6"></div>

            <div className="prose dark:prose-invert max-w-none">
              {content.chapters?.map((chapter, chapIndex) => (
                <div key={chapter.chapter_id || chapIndex}>
                  {chapter.title && (
                    <h1 id={chapter.chapter_id || `chap-${chapIndex}`}>
                      {chapter.title}
                    </h1>
                  )}
                  {chapter.sections?.map((section, secIndex) => (
                    <section key={section.section_id || secIndex}>
                      {section.title && (
                        <h2 id={section.section_id || `sec-${secIndex}`}>
                          {section.title}
                        </h2>
                      )}
                      {section.clauses?.map((clause, clauseIndex) => (
                        <p key={clause.clause_id || clauseIndex}>
                          {clause.original_text}
                        </p>
                      ))}
                    </section>
                  ))}
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* Table of Contents (takes 1 column) */}
        <div className="hidden md:block md:col-span-1 h-full border-l">
          <TableOfContents content={content} />
        </div>
      </div>
    </div>
  );
}
