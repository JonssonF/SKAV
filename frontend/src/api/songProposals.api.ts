import apiClient from './axios';
import type {
  SongProposalResponse,
  CreateSongProposalRequest,
  UpdateSongProposalRequest,
} from '../types/songProposal.types';

export const songProposalsApi = {
  getAll: async (): Promise<SongProposalResponse[]> => {
    const response = await apiClient.get<SongProposalResponse[]>('/song-proposals');
    return response.data;
  },

  getById: async (id: number): Promise<SongProposalResponse> => {
    const response = await apiClient.get<SongProposalResponse>(`/song-proposals/${id}`);
    return response.data;
  },

  create: async (data: CreateSongProposalRequest): Promise<void> => {
    await apiClient.post('/song-proposals', data);
  },

  update: async (id: number, data: UpdateSongProposalRequest): Promise<void> => {
    await apiClient.put(`/song-proposals/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/song-proposals/${id}`);
  },

  vote: async (id: number): Promise<void> => {
    await apiClient.post(`/song-proposals/${id}/vote`);
  },

  setWinner: async (id: number): Promise<void> => {
    await apiClient.put(`/song-proposals/${id}/winner`);
  },

  resetVotes: async (): Promise<void> => {
    await apiClient.post('/song-proposals/reset-votes');
  },
};