"use client";

import { Song } from "@/@types/interfaces";
import { getTableRecords, isSongFields } from "@/service/records";
import { createContext, useContext, useEffect, useState } from "react";
import { useAlbum } from "./AlbumContext";

interface IContext {
  songs: Song[];
  isLoadingSongs: boolean;
  selectedSong: Song | null;
  setSelectedSong: (song: Song) => void;
}

export const SongContext = createContext({} as IContext);

export const SongProvider = ({ children }: { children: React.ReactNode }) => {
  const { selectedAlbum } = useAlbum();

  const [isLoadingSongs, setIsLoadingSongs] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  async function getSongs(albumId: string) {
    try {
      setIsLoadingSongs(true);
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

      setSongs(parsedSongs);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingSongs(false);
    }
  }

  useEffect(() => {
    if(selectedAlbum) {
      getSongs(selectedAlbum.id);
    }
  }, [selectedAlbum]);

  return (
    <SongContext.Provider
      value={{
        songs,
        isLoadingSongs,
        selectedSong,
        setSelectedSong,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const useSong = () => {
  return useContext(SongContext);
};
