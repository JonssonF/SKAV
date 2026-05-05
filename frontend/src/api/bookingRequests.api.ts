import apiClient from './axios';
import type {
  BookingRequestResponse,
  CreateBookingRequest,
  CreateBookingRequestResponse,
} from '../types/bookingRequest.types';

export const bookingRequestsApi = {
  getAll: async (): Promise<BookingRequestResponse[]> => {
    const response = await apiClient.get<BookingRequestResponse[]>('/booking-requests');
    return response.data;
  },

  getById: async (id: number): Promise<BookingRequestResponse> => {
    const response = await apiClient.get<BookingRequestResponse>(`/booking-requests/${id}`);
    return response.data;
  },

  create: async (data: CreateBookingRequest): Promise<CreateBookingRequestResponse> => {
    const response = await apiClient.post<CreateBookingRequestResponse>('/booking-requests', data);
    return response.data;
  },

  markAsRead: async (id: number): Promise<void> => {
    await apiClient.put(`/booking-requests/${id}/read`);
  },
};