import { BASE, BASE_URL, PERSONAL_TOKEN } from "@/@types/constants";
import axios from "axios";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${PERSONAL_TOKEN}`,
  },
});

interface Field {
  type: string;
  id: string;
  name: string;
  options?: {
      isReversed: boolean;
  };
}

interface View {
  id: string;
  name: string;
  type: string;
}

export interface Table {
  id: string;
  name: string;
  primaryFieldId: string;
  fields: Field[];
  views: View[];
}

interface TablesResponse {
  tables: Table[];
}

export const getTables = async () => {
  return api.get<TablesResponse>(`/meta/bases/${BASE}/tables`);
};

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

export const fieldsIsAlbum = (fields: any) : fields is AlbumRecord => {
  return "id" in fields;
}

export interface SongRecord {
  name: string;
  src: RecordAttachment[]
  tone: string; 
  tags: string[];
}

export const fieldsIsSong = (fields: any) : fields is SongRecord => {
  return "tone" in fields;
}

interface RecordItem {
  id: string;
  createdTime: string;
  fields: AlbumRecord | SongRecord;
}

interface RecordsResponse {
  records: RecordItem[];
}

export const getTableRecords = async (tableId: string) => {
    return api.get<RecordsResponse>(`/${BASE}/${tableId}/`, {
      params: {
        sort: [{ field: "name", direction: "asc" }],
      },
    });
  };
