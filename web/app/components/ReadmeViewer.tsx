"use client";

import React, { useMemo, useState } from "react";
import { BookOpen, Search, ExternalLink } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";

type ReadmeViewerProps = {
  markdown: string;
};

// Simplified utility functions
const normalize = (value: string) => value.trim().toLowerCase();
const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const getNodeText = (children: React.ReactNode): string => {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(getNodeText).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(children))
    return getNodeText(children.props.children);
  return "";
};

type MarkdownSection = { headingLine: string | null; lines: string[] };
const splitSections = (markdown: string): MarkdownSection[] => {
  const lines = markdown.split("\n");
  const sections: MarkdownSection[] = [];
  let current: MarkdownSection = { headingLine: null, lines: [] };
  lines.forEach((line) => {
    if (line.startsWith("## ")) {
      if (current.lines.length > 0) sections.push(current);
      current = { headingLine: line, lines: [line] };
      return;
    }
    current.lines.push(line);
  });
  if (current.lines.length > 0) sections.push(current);
  return sections;
};

const filterMarkdown = (markdown: string, query: string) => {
  if (!query) return markdown;
  const normalizedQuery = normalize(query);
  const sections = splitSections(markdown);
  const filteredSections: string[] = [];
  sections.forEach((section) => {
    const { headingLine, lines } = section;
    const startIndex = headingLine ? 1 : 0;
    const filteredLines: string[] = [];
    let hasMatch = false;
    let includeContinuation = false;
    for (let i = startIndex; i < lines.length; i += 1) {
      const line = lines[i];
      const trimmed = line.trim();
      const isListItem = /^[-*+]\s+/.test(trimmed);
      const isIndented = /^\s{2,}\S/.test(line);
      if (isListItem) {
        includeContinuation = normalize(line).includes(normalizedQuery);
        if (includeContinuation) {
          filteredLines.push(line);
          hasMatch = true;
        }
        continue;
      }
      if (includeContinuation && isIndented) {
        filteredLines.push(line);
        continue;
      }
      includeContinuation = false;
      if (trimmed === "") {
        if (
          filteredLines.length > 0 &&
          filteredLines[filteredLines.length - 1] !== ""
        )
          filteredLines.push("");
        continue;
      }
      if (normalize(line).includes(normalizedQuery)) {
        filteredLines.push(line);
        hasMatch = true;
      }
    }
    if (!hasMatch) return;
    if (headingLine) filteredLines.unshift(headingLine);
    filteredSections.push(filteredLines.join("\n"));
  });
  return filteredSections.join("\n\n").trim();
};

const extractHeadings = (markdown: string) => {
  const headings = [];
  const regex = /^##\s+(.+)$/gm;
  let match = regex.exec(markdown);
  while (match) {
    headings.push({ id: slugify(match[1].trim()), text: match[1].trim() });
    match = regex.exec(markdown);
  }
  return headings;
};

export default function ReadmeViewer({ markdown }: ReadmeViewerProps) {
  // Remove HTML comments from the markdown source
  const cleanedMarkdown = useMemo(
    () => markdown.replace(/<!--[\s\S]*?-->/g, ""),
    [markdown],
  );
  const [query, setQuery] = useState("");
  const filteredMarkdown = useMemo(
    () => filterMarkdown(cleanedMarkdown, query),
    [cleanedMarkdown, query],
  );
  const tocSource = query ? filteredMarkdown : cleanedMarkdown;
  const headings = useMemo(() => extractHeadings(tocSource), [tocSource]);

  const components: Components = {
    h1: ({ children }) => (
      <h1 className="flex flex-wrap items-center gap-3 text-4xl font-bold tracking-tight mb-6 [&_a]:no-underline">
        {children}
      </h1>
    ),
    h2: ({ children }) => {
      const id = slugify(getNodeText(children));
      return (
        <h2
          id={id}
          className="scroll-mt-24 border-b-2 border-border pb-2 text-2xl font-bold mt-10 mb-4"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-8 mb-3">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mb-4 leading-relaxed last:mb-0">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-6 space-y-2 mb-4">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-2 mb-4">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="marker:text-foreground">{children}</li>
    ),
    a: ({ href, children }) => {
      let resolvedHref = href;
      let isExternal = false;

      if (href) {
        if (href.startsWith("http") || href.startsWith("mailto:")) {
          isExternal = true;
        } else if (!href.startsWith("#")) {
          const cleanHref = href.startsWith("/") ? href.slice(1) : href;
          resolvedHref = `https://github.com/henrymmey/awesome-ai-for-beginners/blob/main/${cleanHref}`;
          isExternal = true;
        }
      }

      return (
        <a
          href={resolvedHref}
          className="font-medium underline decoration-border hover:decoration-foreground underline-offset-4"
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-foreground/30 px-5 py-4 italic bg-secondary-background mb-4 rounded-r-md [&>p]:mb-0">
        {children}
      </blockquote>
    ),
    pre: ({ children }) => (
      <pre className="overflow-x-auto rounded border border-border bg-secondary-background p-4 text-sm mb-4">
        {children}
      </pre>
    ),
    code: ({ children, className }) => {
      const isInline = !className;
      if (isInline)
        return (
          <code className="rounded border border-border bg-secondary-background px-1.5 py-0.5 text-sm font-mono">
            {children}
          </code>
        );
      return <code className={className}>{children}</code>;
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-6 py-12 lg:flex-row lg:px-10 lg:py-24">
        <aside className="lg:w-72 shrink-0 order-2 lg:order-1">
          <div className="sticky top-12 space-y-8">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-2 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter content..."
                  className="w-full rounded-md border-2 border-border bg-background py-2 pl-9 pr-4 text-sm font-medium outline-none focus:border-foreground transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-4">
                Contents
              </div>
              <nav className="flex flex-col space-y-2 text-sm border-l-2 border-border mb-6">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className="block border-l-2 -ml-[2px] border-transparent pl-4 py-1 text-foreground/70 hover:text-foreground hover:border-foreground font-medium transition-colors"
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>

              <div className="pt-2 flex flex-col gap-3">
                <a
                  href="https://github.com/henrymmey/awesome-ai-for-beginners"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-foreground hover:underline decoration-foreground underline-offset-4"
                >
                  GitHub <ExternalLink className="ml-1 h-3 w-3" />
                </a>
                <span className="text-xs text-foreground/60">
                  <a
                    href="https://henrymeyer.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-medium hover:text-foreground transition-colors"
                  >
                    Curated by HenryMM <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </span>

                {/* Legal links moved to site footer */}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 order-1 lg:order-2">
          <div className="prose-container max-w-[750px]">
            {filteredMarkdown ? (
              <ReactMarkdown components={components}>
                {filteredMarkdown}
              </ReactMarkdown>
            ) : (
              <div className="rounded-md border-2 border-dashed border-border p-8 text-center bg-secondary-background">
                <p className="text-lg font-bold">No results found.</p>
                <p className="mt-2 text-foreground/70">
                  Try a different search term.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
