import apiClient from './axios';
import type { SendNewsletterRequest, SendNewsletterResponse } from '../types/newsletter.types';

export const newsletterApi = {
  send: async (data: SendNewsletterRequest): Promise<SendNewsletterResponse> => {
    const response = await apiClient.post<SendNewsletterResponse>('/newsletter', data);
    return response.data;
  },
};