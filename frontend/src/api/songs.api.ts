import apiClient from './axios';
import type {
  SongResponse,
  CreateSongRequest,
  CreateSongResponse,
  UpdateSongRequest,
} from '../types/song.types';

export const songsApi = {
  getAll: async (): Promise<SongResponse[]> => {
    const response = await apiClient.get<SongResponse[]>('/songs');
    return response.data;
  },

  getById: async (id: number): Promise<SongResponse> => {
    const response = await apiClient.get<SongResponse>(`/songs/${id}`);
    return response.data;
  },

  create: async (data: CreateSongRequest): Promise<CreateSongResponse> => {
    const response = await apiClient.post<CreateSongResponse>('/songs', data);
    return response.data;
  },

  update: async (id: number, data: UpdateSongRequest): Promise<void> => {
    await apiClient.put(`/songs/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/songs/${id}`);
  },
};