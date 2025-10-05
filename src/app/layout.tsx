import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AlbumProvider } from "@/contexts/AlbumContext";

const font = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SpotiCristo",
  description: "App para ouvir as gravadas para Cristo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={font.className}>
        <AlbumProvider>
          {children}
        </AlbumProvider>
      </body>
    </html>
  );
}
