import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingRequestsApi } from '../../../api/bookingRequests.api';
import type { CreateBookingRequest } from '../../../types/bookingRequest.types';

export function useBookingRequests() {
  return useQuery({
    queryKey: ['bookingRequests'],
    queryFn: bookingRequestsApi.getAll,
  });
}

export function useBookingRequest(id: number) {
  return useQuery({
    queryKey: ['bookingRequests', id],
    queryFn: () => bookingRequestsApi.getById(id),
    enabled: id > 0,
  });
}

export function useCreateBookingRequest() {
  return useMutation({
    mutationFn: (data: CreateBookingRequest) => bookingRequestsApi.create(data),
  });
}

export function useMarkBookingRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bookingRequestsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingRequests'] });
    },
  });
}