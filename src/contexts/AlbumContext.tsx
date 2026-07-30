"use client";

import { ALBUMS_TABLE_ID } from "@/@types/constants";
import { Album } from "@/@types/interfaces";
import { isAlbumFields, getTableRecords } from "@/service/records";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";

interface IContext {
  albums: Album[];
  isLoadingAlbums: boolean;
}

export const AlbumContext = createContext({} as IContext);

async function fetchAlbums(): Promise<Album[]> {
  try {
    const response = await getTableRecords(ALBUMS_TABLE_ID);

    const parsedAlbums: Album[] = [];
    response.data.records.forEach((record) => {
      if (isAlbumFields(record.fields)) {
        parsedAlbums.push({
          id: record.fields.id || "",
          name: record.fields.name || "",
          banner: record.fields.banner?.[0]?.url || "",
          color: record.fields.color || "",
          tags: record.fields.tags || [],
        });
      }
    });

    return parsedAlbums;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const AlbumProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: albums = [], isLoading: isLoadingAlbums } = useQuery({
    queryKey: ["albums"],
    queryFn: fetchAlbums,
  });

  return (
    <AlbumContext.Provider
      value={{
        albums,
        isLoadingAlbums,
      }}
    >
      {children}
    </AlbumContext.Provider>
  );
};

export const useAlbum = () => {
  return useContext(AlbumContext);
};
