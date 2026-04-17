import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use((response) => {
  const body = response.data;
  if (body && typeof body === "object" && "success" in body) {
    const { data, meta } = body as { data: unknown; meta?: unknown };
    response.data = meta !== undefined ? { ...(data as object), meta } : data;
  }
  return response;
});

export default api;
