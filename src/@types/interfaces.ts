export interface Song {
    id: string;
    tone: string;
    name: string;
    src: string;
    tags: string[];
}

export interface Album {
    id: string;
    name: string;
    banner: string;
    color: string;
    tags: string[];
}