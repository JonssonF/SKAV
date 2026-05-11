import apiClient from './axios';
import type { SubscriberResponse, SubscriberRequest } from '../types/subscriber.types';

export const subscribersApi = {
  getAll: async (): Promise<SubscriberResponse[]> => {
    const response = await apiClient.get<SubscriberResponse[]>('/subscribers');
    return response.data;
  },

  subscribe: async (data: SubscriberRequest): Promise<SubscriberResponse> => {
    const response = await apiClient.post<SubscriberResponse>('/subscribers', data);
    return response.data;
  },

  unsubscribe: async (data: SubscriberRequest): Promise<void> => {
    await apiClient.delete('/subscribers', { data });
  },
};