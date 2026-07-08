import { BASE } from "@/@types/constants";
import { api } from "./api";

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
