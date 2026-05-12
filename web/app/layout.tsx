import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Awesome AI for Beginners",
    template: "%s | Awesome AI for Beginners",
  },
  description:
    "Curated resources to understand and use AI without any technical background. Learn AI tools, prompts, and basics easily.",
  keywords: [
    "AI",
    "Artificial Intelligence",
    "Beginners",
    "Machine Learning",
    "Prompt Engineering",
    "ChatGPT",
    "Tools",
  ],
  authors: [{ name: "Awesome AI Community" }],
  creator: "Awesome AI Community",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://awesome-ai-for-beginners.vercel.app",
    title: "Awesome AI for Beginners",
    description:
      "Curated resources to understand and use AI without any technical background.",
    siteName: "Awesome AI for Beginners",
  },
  twitter: {
    card: "summary_large_image",
    title: "Awesome AI for Beginners",
    description:
      "Curated resources to understand and use AI without any technical background.",
    creator: "@awesomeai",
  },
  metadataBase: new URL("https://awesome-ai-for-beginners.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full font-sans">
        {children}

        <footer className="mt-12 border-t border-border bg-secondary-background">
          <div className="mx-auto max-w-[1200px] px-6 py-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2">
              <div className="text-xs text-foreground/60">
                © {new Date().getFullYear()} Awesome AI for Beginners
              </div>
              <div className="text-xs text-foreground/60">
                Website licensed under
                <a
                  href="https://www.gnu.org/licenses/gpl-3.0.en.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 font-medium hover:underline"
                >
                  GPL-3.0
                </a>
                , content under
                <a
                  href="https://creativecommons.org/publicdomain/zero/1.0/legalcode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 font-medium hover:underline"
                >
                  CC0-1.0
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="http://henrymeyer.de/legal/imprint"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                Imprint
              </a>
              <a
                href="http://henrymeyer.de/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                Privacy Legacy
              </a>
            </div>
          </div>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
