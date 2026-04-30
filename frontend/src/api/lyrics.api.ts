import apiClient from "./axios";
import type{
    LyricsResponse,
    CreateLyricsRequest,
    CreateLyricsResponse,
    UpdateLyricsRequest,
} from '../types/lyrics.types';

export const lyricsApi = {

    getAll: async (): Promise<LyricsResponse[]> => {
    const response = await apiClient.get<LyricsResponse[]>('/lyrics');
    return response.data;
    },

    getBySongId: async (songId: number): Promise<LyricsResponse | null> => {
    try {
      const response = await apiClient.get<LyricsResponse>(`/lyrics/by-song/${songId}`);
      return response.data;
    } catch {
      return null;
    }
    },

    getBySlug: async (slug: string): Promise<LyricsResponse> => {
        const response = await apiClient.get<LyricsResponse>(`/lyrics/${slug}`);
        return response.data;
    },

    create: async (data: CreateLyricsRequest): Promise<CreateLyricsResponse> => {
        const response = await apiClient.post<CreateLyricsResponse>('/lyrics', data);
        return response.data;
    },

    update: async (id: number, data: UpdateLyricsRequest): Promise<void> => {
        await apiClient.put(`/lyrics/${id}`, data);
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/lyrics/${id}`);
    },
};