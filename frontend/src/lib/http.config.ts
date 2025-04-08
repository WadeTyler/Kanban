import HttpClient from "@/lib/http/HttpClient";
import {API_URL} from "@/environment";

export const http: HttpClient = new HttpClient({
  apiUrl: API_URL,
  credentials: "include"
});
