"use client";

import { useAlbum } from "@/contexts/AlbumContext";
import AlbumSection from "@/components/AlbumSection";
import { Music } from "lucide-react";

export default function Home() {
  const { albums, isLoadingAlbums } = useAlbum();

  return (
    <div className="p-4 lg:p-6 space-y-8 animate-fade-in">
      <section className="relative">
        <div className="bg-gradient-to-r from-spotify-green/20 to-primary-600/20 rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm border border-dark-700">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-spotify-green to-spotify-green-light rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
              <Music className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
                Bem-vindo ao CristoSound
              </h1>
              <p className="text-sm sm:text-base text-dark-300">
                Aqui você encontra algumas músicas gravadas em ensaios.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AlbumSection
        title="Todos os Álbuns"
        albums={albums}
        isLoading={isLoadingAlbums}
      />
    </div>
  );
}
