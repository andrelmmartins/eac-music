"use client";

import { useSong } from "@/contexts/SongContext";
import { useAlbum } from "@/contexts/AlbumContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AlbumHeader from "@/components/AlbumHeader";
import SongList from "@/components/SongList";
import MusicPlayer from "@/components/MusicPlayer";
import { ArrowLeft, Music } from "lucide-react";
import Link from "next/link";

export default function AlbumPage() {
  const { albumId } = useParams();
  const { albums } = useAlbum();
  const { 
    songs, 
    isLoadingSongs, 
    currentSong, 
    isPlaying, 
    getSongs, 
    setCurrentSong, 
    setIsPlaying, 
    playNext, 
    playPrevious 
  } = useSong();

  const [currentAlbum, setCurrentAlbum] = useState<any>(null);

  useEffect(() => {
    if (albumId) {
      getSongs(albumId as string);
      const album = albums.find(album => album.id === albumId);
      setCurrentAlbum(album);
    }
  }, [albumId, albums]);

  const handlePlayAll = () => {
    if (songs.length > 0) {
      setCurrentSong(songs[0]);
      setIsPlaying(true);
    }
  };

  const handleSongSelect = (song: any) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleClosePlayer = () => {
    setCurrentSong(null);
    setIsPlaying(false);
  };

  if (!currentAlbum) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🎵</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Álbum não encontrado</h1>
          <p className="text-dark-300 mb-6">O álbum que você está procurando não existe ou foi removido.</p>
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 bg-spotify-green text-black px-6 py-3 rounded-full font-semibold hover:bg-spotify-green-light transition-colors hover:scale-105 transform"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para início</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-dark-700">
        <div className="px-8 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-white hover:text-spotify-green transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>
        </div>
      </div>

      <AlbumHeader 
        album={currentAlbum} 
        onPlayAll={handlePlayAll}
      />

      <div className="px-4 lg:px-8 py-8">
        {isLoadingSongs ? (
          <div className="bg-dark-800/50 backdrop-blur-sm rounded-lg border border-dark-700 overflow-hidden">
            <div className="px-8 py-4 border-b border-dark-700">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-1 flex justify-center">
                  <div className="w-4 h-4 bg-dark-700 rounded animate-pulse"></div>
                </div>
                <div className="col-span-5">
                  <div className="w-32 h-4 bg-dark-700 rounded animate-pulse"></div>
                </div>
                <div className="col-span-3">
                  <div className="w-16 h-4 bg-dark-700 rounded animate-pulse"></div>
                </div>
                <div className="col-span-2">
                  <div className="w-20 h-4 bg-dark-700 rounded animate-pulse"></div>
                </div>
                <div className="col-span-1 flex justify-center">
                  <div className="w-4 h-4 bg-dark-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-dark-700">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="px-8 py-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 flex justify-center">
                      <div className="w-4 h-4 bg-dark-700 rounded animate-pulse"></div>
                    </div>
                    <div className="col-span-5">
                      <div className="w-48 h-4 bg-dark-700 rounded animate-pulse mb-2"></div>
                      <div className="w-32 h-3 bg-dark-700 rounded animate-pulse"></div>
                    </div>
                    <div className="col-span-3">
                      <div className="w-8 h-4 bg-dark-700 rounded animate-pulse"></div>
                    </div>
                    <div className="col-span-2">
                      <div className="w-16 h-4 bg-dark-700 rounded animate-pulse"></div>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <div className="w-8 h-4 bg-dark-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : songs.length > 0 ? (
          <SongList
            songs={songs}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onSongSelect={handleSongSelect}
            onPlayPause={handlePlayPause}
          />
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-dark-400" />
            </div>
            <p className="text-dark-400">Nenhuma música encontrada neste álbum</p>
          </div>
        )}
      </div>

      <MusicPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={playNext}
        onPrevious={playPrevious}
        onSongSelect={handleSongSelect}
        onClose={handleClosePlayer}
      />
    </div>
  );
}
