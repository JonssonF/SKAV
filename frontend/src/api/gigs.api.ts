import apiClient from './axios';
import type { GigResponse } from '../types/gig.types';

export const gigsApi = {
  getAll: async (): Promise<GigResponse[]> => {
    const response = await apiClient.get<GigResponse[]>('/gigs');
    return response.data;
  },

  getById: async (id: number): Promise<GigResponse> => {
    const response = await apiClient.get<GigResponse>(`/gigs/${id}`);
    return response.data;
  },
};