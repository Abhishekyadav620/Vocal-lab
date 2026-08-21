import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vocalis AI — Multimodal Voice & Vision Agentic OS",
  description: "Next-generation multimodal voice and vision operating assistant powered by FastAPI and Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#030712] text-gray-100">
        {children}
      </body>
    </html>
  );
}
