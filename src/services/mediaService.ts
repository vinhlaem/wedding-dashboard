import api from "@/lib/api";
import { Media, MediaComponent, MediaType } from "@/types/media";

const BASE = "/api/media";

export const mediaApi = {
  getAll: async (
    component?: MediaComponent,
    role?: string,
  ): Promise<Media[]> => {
    const params: Record<string, string> = {};
    if (component) params.component = component;
    if (role) params.role = role;
    const { data } = await api.get(BASE, { params });
    return data.data;
  },

  upload: async (
    file: File,
    component: MediaComponent,
    order = 0,
    role?: string,
    mediaType: MediaType = "image",
  ): Promise<Media> => {
    const form = new FormData();
    form.append("file", file);
    form.append("component", component);
    form.append("order", String(order));
    form.append("mediaType", mediaType);
    if (role) form.append("role", role);
    const { data } = await api.post(`${BASE}/upload`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },

  importFromDrive: async (
    driveFileId: string,
    accessToken: string,
    component: MediaComponent,
    order = 0,
    role?: string,
  ): Promise<Media> => {
    const { data } = await api.post(`${BASE}/import-drive`, {
      driveFileId,
      accessToken,
      component,
      order,
      role: role || undefined,
    });
    return data.data;
  },

  update: async (id: string, payload: Partial<Media>): Promise<Media> => {
    const { data } = await api.put(`${BASE}/${id}`, payload);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE}/${id}`);
  },

  reorder: async (items: { id: string; order: number }[]): Promise<void> => {
    await api.patch(`${BASE}/reorder`, { items });
  },
};
