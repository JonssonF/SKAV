import apiClient from './axios';
import type {
  GigResponse,
  CreateGigRequest,
  CreateGigResponse,
  UpdateGigRequest,
} from '../types/gig.types';

export const gigsApi = {
  getAll: async (): Promise<GigResponse[]> => {
    const response = await apiClient.get<GigResponse[]>('/gigs');
    return response.data;
  },

  getById: async (id: number): Promise<GigResponse> => {
    const response = await apiClient.get<GigResponse>(`/gigs/${id}`);
    return response.data;
  },

  create: async (data: CreateGigRequest): Promise<CreateGigResponse> => {
    const response = await apiClient.post<CreateGigResponse>('/gigs', data);
    return response.data;
  },

  update: async (id: number, data: UpdateGigRequest): Promise<void> => {
    await apiClient.put(`/gigs/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/gigs/${id}`);
  },
};