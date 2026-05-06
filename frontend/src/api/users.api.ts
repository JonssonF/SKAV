import apiClient from './axios';
import type {
  UserResponse,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRoleRequest,
  ChangePasswordRequest,
} from '../types/user.types';

export const usersApi = {
  getAll: async (): Promise<UserResponse[]> => {
    const response = await apiClient.get<UserResponse[]>('/users');
    return response.data;
  },

  create: async (data: CreateUserRequest): Promise<CreateUserResponse> => {
    const response = await apiClient.post<CreateUserResponse>('/users', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  updateRole: async (id: number, data: UpdateUserRoleRequest): Promise<void> => {
    await apiClient.put(`/users/${id}/role`, data);
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.put('/users/me/password', data);
  },
};