import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
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
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
