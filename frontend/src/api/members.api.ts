import apiClient from './axios';
import type {
  MemberResponse,
  CreateMemberRequest,
  CreateMemberResponse,
  UpdateMemberRequest,
} from '../types/member.types';

export const membersApi = {
  getAll: async (): Promise<MemberResponse[]> => {
    const response = await apiClient.get<MemberResponse[]>('/members');
    return response.data;
  },

  getById: async (id: number): Promise<MemberResponse> => {
    const response = await apiClient.get<MemberResponse>(`/members/${id}`);
    return response.data;
  },

  create: async (data: CreateMemberRequest): Promise<CreateMemberResponse> => {
    const response = await apiClient.post<CreateMemberResponse>('/members', data);
    return response.data;
  },

  update: async (id: number, data: UpdateMemberRequest): Promise<void> => {
    await apiClient.put(`/members/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/members/${id}`);
  },
};