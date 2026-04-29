import apiClient from './axios';
import type { AlbumResponse, CreateAlbumRequest, CreateAlbumResponse } from '../types/album.types';

export const albumsApi = {
  getAll: async (): Promise<AlbumResponse[]> => {
    const response = await apiClient.get<AlbumResponse[]>('/albums');
    return response.data;
  },

  getById: async (id: number): Promise<AlbumResponse> => {
    const response = await apiClient.get<AlbumResponse>(`/albums/${id}`);
    return response.data;
  },

  create: async (data: CreateAlbumRequest): Promise<CreateAlbumResponse> => {
    const response = await apiClient.post<CreateAlbumResponse>('/albums', data);
    return response.data;
  },
};