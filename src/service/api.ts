import { BASE_URL, PERSONAL_TOKEN } from "@/@types/constants";
import axios from "axios";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${PERSONAL_TOKEN}`,
  },
});
