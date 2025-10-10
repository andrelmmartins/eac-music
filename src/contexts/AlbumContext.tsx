'use client'

import { ALBUMS_TABLE_ID } from "@/@types/constants";
import { Album } from "@/@types/interfaces";
import { isAlbumFields, getTableRecords } from "@/service/records";
import { createContext, useContext, useEffect, useState } from "react";

interface IContext {
    albums: Album[];
    isLoadingAlbums: boolean;
}

export const AlbumContext = createContext({} as IContext);

export const AlbumProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoadingAlbums, setIsLoadingAlbums] = useState(false);
    const [albums, setAlbums] = useState<Album[]>([]);

    async function getAlbums() {
        try {
            setIsLoadingAlbums(true);
            const response = await getTableRecords(ALBUMS_TABLE_ID);

            const parsedAlbums: Album[] = [];
            response.data.records.forEach((record) => {
                if (isAlbumFields(record.fields)) {
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
        <AlbumContext.Provider value={{
            albums,
            isLoadingAlbums,
        }}>
            {children}
        </AlbumContext.Provider>
    )
}

export const useAlbum = () => {
    return useContext(AlbumContext);
}