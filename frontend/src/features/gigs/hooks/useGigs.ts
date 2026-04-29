import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gigsApi } from '../../../api/gigs.api';
import type { CreateGigRequest, UpdateGigRequest } from '../../../types/gig.types';

export function useGigs() {
  return useQuery({
    queryKey: ['gigs'],
    queryFn: gigsApi.getAll,
  });
}

export function useGig(id: number) {
  return useQuery({
    queryKey: ['gigs', id],
    queryFn: () => gigsApi.getById(id),
    enabled: id > 0,
  });
}

export function useCreateGig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGigRequest) => gigsApi.create(data),
    onSuccess: () => {
      // Invalidera cachen — tvingar listan att hämtas om
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
    },
  });
}

export function useUpdateGig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGigRequest }) =>
      gigsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
    },
  });
}

export function useDeleteGig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => gigsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
    },
  });
}