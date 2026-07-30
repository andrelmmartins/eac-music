"use client";

import { Song } from "@/@types/interfaces";
import { getTableRecords, isSongFields } from "@/service/records";
import { useQuery } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useState } from "react";

interface IContext {
  songs: Song[];
  isLoadingSongs: boolean;
  currentSong: Song | null;
  isPlaying: boolean;
  currentAlbumId: string | null;
  getSongs: (albumId: string) => void;
  setCurrentSong: (song: Song | null) => void;
  setIsPlaying: (playing: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const SongContext = createContext({} as IContext);

async function fetchSongs(albumId: string): Promise<Song[]> {
  try {
    const response = await getTableRecords(albumId);

    const parsedSongs: Song[] = [];
    response.data.records.forEach((record) => {
      if (isSongFields(record.fields)) {
        parsedSongs.push({
          id: record.id || "",
          tone: record.fields.tone || "",
          name: record.fields.name || "",
          src: record.fields.src?.[0]?.url || "",
          tags: record.fields.tags || [],
        });
      }
    });

    return parsedSongs;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const SongProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAlbumId, setCurrentAlbumId] = useState<string | null>(null);

  const { data: songs = [], isLoading: isLoadingSongs } = useQuery({
    queryKey: ["songs", currentAlbumId],
    queryFn: () => fetchSongs(currentAlbumId!),
    enabled: !!currentAlbumId,
  });

  const getSongs = useCallback((albumId: string) => {
    setCurrentAlbumId(albumId);
  }, []);

  const playNext = useCallback(() => {
    if (currentSong && songs.length > 0) {
      const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
      const nextIndex = (currentIndex + 1) % songs.length;
      setCurrentSong(songs[nextIndex]);
    }
  }, [currentSong, songs]);

  const playPrevious = useCallback(() => {
    if (currentSong && songs.length > 0) {
      const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
      const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
      setCurrentSong(songs[prevIndex]);
    }
  }, [currentSong, songs]);

  return (
    <SongContext.Provider
      value={{
        songs,
        isLoadingSongs,
        currentSong,
        isPlaying,
        currentAlbumId,
        getSongs,
        setCurrentSong,
        setIsPlaying,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const useSong = () => {
  return useContext(SongContext);
};
