/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api";

const BASE = "/api/slides";

export const slidesApi = {
  getAll: async () => {
    const { data } = await api.get(BASE);
    return data.data;
  },

  create: async (payload: {
    type: string;
    images: string[];
    caption?: string;
    order?: number;
  }) => {
    const { data } = await api.post(BASE, payload);
    return data.data;
  },

  update: async (id: string, payload: Partial<any>) => {
    const { data } = await api.put(`${BASE}/${id}`, payload);
    return data.data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`${BASE}/${id}`);
    return data.data;
  },

  reorder: async (items: { id: string; order: number }[]) => {
    await api.patch(`${BASE}/reorder`, { items });
  },
};
