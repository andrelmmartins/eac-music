export interface Song {
    tone: string;
    name: string;
    src: string;
}

export interface Album {
    name: string;
    songs: Song[];
}