import apiClient from './axios';
import type {
  BookingRecipientResponse,
  CreateBookingRecipientRequest,
  CreateBookingRecipientResponse,
} from '../types/bookingRecipient.types';

export const bookingRecipientsApi = {
  getAll: async (): Promise<BookingRecipientResponse[]> => {
    const response = await apiClient.get<BookingRecipientResponse[]>('/booking-recipients');
    return response.data;
  },

  create: async (data: CreateBookingRecipientRequest): Promise<CreateBookingRecipientResponse> => {
    const response = await apiClient.post<CreateBookingRecipientResponse>('/booking-recipients', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/booking-recipients/${id}`);
  },
};