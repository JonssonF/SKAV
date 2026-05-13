import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productOrdersApi } from '../../../api/productOrders.api';
import type { CreateProductOrderRequest } from '../../../types/productOrder.types';

export function useProductOrders() {
  return useQuery({
    queryKey: ['productOrders'],
    queryFn: productOrdersApi.getAll,
  });
}

export function useCreateProductOrder() {
  return useMutation({
    mutationFn: (data: CreateProductOrderRequest) => productOrdersApi.create(data),
  });
}

export function useHandleProductOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productOrdersApi.handle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productOrders'] });
    },
  });
}