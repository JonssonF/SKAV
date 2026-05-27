import apiClient from './axios';
import type { LoginRequest, LoginResponse } from '../types/auth.types';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  forgotPassword: async (data: { email: string }): Promise<void> => {
    await apiClient.post('/auth/forgot-password', data);
  },

  resetPassword: async (data: { token: string; newPassword: string }): Promise<void> => {
    await apiClient.post('/auth/reset-password', data);
  },
};