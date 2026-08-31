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
  playlist?: string | string[];
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
  offset?: string;
}

export const getTableRecords = async (
  tableId: string,
) => {
  const records: RecordItem[] = [];
  let offset: string | undefined;

  do {
    const response = await api.get<RecordsResponse>(`/${BASE}/${tableId}/`, {
      params: {
        sort: [{ field: "name", direction: "asc" }],
        ...(offset ? { offset } : {}),
      },
    });

    records.push(...response.data.records);
    offset = response.data.offset;
  } while (offset);

  return { records };
};
