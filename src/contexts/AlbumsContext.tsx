'use client'

import { Album } from "@/@types/interfaces";
import { getTables } from "@/service/api";
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
            const response = await getTables();
            setAlbums(response.data.tables.map((table) => ({
                name: table.name,
                songs: []
            })));
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