import apiClient from './axios';
import type {
  SendNewsletterRequest,
  SendNewsletterResponse,
  PreviewNewsletterRequest,
  PreviewNewsletterResponse,
} from '../types/newsletter.types';

export const newsletterApi = {
  send: async (data: SendNewsletterRequest): Promise<SendNewsletterResponse> => {
    const response = await apiClient.post<SendNewsletterResponse>('/newsletter', data);
    return response.data;
  },

  preview: async (data: PreviewNewsletterRequest): Promise<PreviewNewsletterResponse> => {
    const response = await apiClient.post<PreviewNewsletterResponse>('/newsletter/preview', data);
    return response.data;
  },
};