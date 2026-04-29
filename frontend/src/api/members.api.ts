import apiClient from './axios';
import type { MemberResponse } from '../types/member.types';

export const membersApi = {
  getAll: async (): Promise<MemberResponse[]> => {
    const response = await apiClient.get<MemberResponse[]>('/members');
    return response.data;
  },

  getById: async (id: number): Promise<MemberResponse> => {
    const response = await apiClient.get<MemberResponse>(`/members/${id}`);
    return response.data;
  },
};