import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productOrderRecipientsApi } from '../../../api/productOrderRecipients.api';
import type { CreateProductOrderRecipientRequest } from '../../../types/productOrderRecipient.types';

export function useProductOrderRecipients() {
  return useQuery({
    queryKey: ['productOrderRecipients'],
    queryFn: productOrderRecipientsApi.getAll,
  });
}

export function useCreateProductOrderRecipient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductOrderRecipientRequest) =>
      productOrderRecipientsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productOrderRecipients'] });
    },
  });
}

export function useDeleteProductOrderRecipient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productOrderRecipientsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productOrderRecipients'] });
    },
  });
}