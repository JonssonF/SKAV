import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingRecipientsApi } from '../../../api/bookingRecipients.api';
import type { CreateBookingRecipientRequest } from '../../../types/bookingRecipient.types';

export function useBookingRecipients() {
  return useQuery({
    queryKey: ['bookingRecipients'],
    queryFn: bookingRecipientsApi.getAll,
  });
}

export function useCreateBookingRecipient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingRecipientRequest) => bookingRecipientsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingRecipients'] });
    },
  });
}

export function useDeleteBookingRecipient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bookingRecipientsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingRecipients'] });
    },
  });
}