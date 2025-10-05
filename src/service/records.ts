import { BASE } from "@/@types/constants";
import { api } from "./api";

interface RecordAttachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
}

export interface AlbumRecord {
  id: string;
  name: string;
  banner: RecordAttachment[];
  color: string;
  tags: string[];
}

export const fieldsIsAlbum = (fields: any): fields is AlbumRecord => {
  return "id" in fields;
};

export interface SongRecord {
  name: string;
  src: RecordAttachment[];
  tone: string;
  tags: string[];
  likes: number;
}

export const fieldsIsSong = (fields: any): fields is SongRecord => {
  return "tone" in fields;
};

interface RecordItem {
  id: string;
  createdTime: string;
  fields: AlbumRecord | SongRecord;
}

interface RecordsResponse {
  records: RecordItem[];
}

export const getTableRecords = async (
  tableId: string,
  sortType: "name" | "likes"
) => {
  const sortField = sortType === "name" ? "name" : "likes";
  const sortDirection = sortType === "name" ? "asc" : "desc";

  return api.get<RecordsResponse>(`/${BASE}/${tableId}/`, {
    params: {
      sort: [{ field: sortField, direction: sortDirection }],
    },
  });
};
