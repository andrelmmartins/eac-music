import { BASE } from "@/@types/constants";
import { api } from "./api";

interface RecordAttachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
}

export interface AlbumFields {
  id: string;
  name: string;
  banner: RecordAttachment[];
  color: string;
  tags: string[];
}

export const isAlbumFields = (fields: any): fields is AlbumFields => {
  return "id" in fields;
};

export interface SongFields {
  name: string;
  src: RecordAttachment[];
  tone: string;
  tags: string[];
  views: number;
}

export const isSongFields = (fields: any): fields is SongFields => {
  return "tone" in fields;
};

interface RecordItem {
  id: string;
  createdTime: string;
  fields: AlbumFields | SongFields;
}

interface RecordsResponse {
  records: RecordItem[];
}

export const getTableRecords = async (
  tableId: string,
) => {
  return api.get<RecordsResponse>(`/${BASE}/${tableId}/`, {
    params: {
      sort: [{ field: "name", direction: "asc" }],
    },
  });
};
