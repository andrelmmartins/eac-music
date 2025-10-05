'use client'

import { ALBUMS_TABLE_ID } from "@/@types/constants";
import { Album } from "@/@types/interfaces";
import { fieldsIsAlbum, getTableRecords } from "@/service/api";
import { createContext, useContext, useEffect, useState } from "react";

interface IContext {
    albums: Album[];
    isLoadingAlbums: boolean;
    selectedAlbum: Album | null;
    setSelectedAlbum: (album: Album) => void;
}

export const AlbumsContext = createContext({} as IContext);

export const AlbumsProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoadingAlbums, setIsLoadingAlbums] = useState(false);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

    async function getAlbums() {
        try {
            setIsLoadingAlbums(true);
            const response = await getTableRecords(ALBUMS_TABLE_ID);

            const parsedAlbums: Album[] = [];
            response.data.records.forEach((record) => {
                if (fieldsIsAlbum(record.fields)) {
                    parsedAlbums.push({
                        id: record.fields.id || "",
                        name: record.fields.name || "",
                        banner: record.fields.banner?.[0]?.url || "",
                        color: record.fields.color || "",
                        tags: record.fields.tags || []
                    });
                }
            });

            setAlbums(parsedAlbums);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingAlbums(false);
        }
    }

    useEffect(() => {
        getAlbums();
    }, []);
    
    return (
        <AlbumsContext.Provider value={{
            albums,
            isLoadingAlbums,
            selectedAlbum,
            setSelectedAlbum
        }}>
            {children}
        </AlbumsContext.Provider>
    )
}

export const useAlbums = () => {
    return useContext(AlbumsContext);
}