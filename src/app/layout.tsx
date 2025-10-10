import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { AlbumProvider } from "@/contexts/AlbumContext";
import { SongProvider } from "@/contexts/SongContext";
import Sidebar from "@/components/Sidebar";

const font = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CristoSound",
  description: "Sua plataforma de música cristã",
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
          <SongProvider>
            <div className="flex h-screen bg-dark-900">
              <Sidebar />
              
              <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                <main className="flex-1 overflow-y-auto">
                  {children}
                </main>
              </div>
            </div>
          </SongProvider>
        </AlbumProvider>
      </body>
    </html>
  );
}
