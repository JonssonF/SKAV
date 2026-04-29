import { useQuery } from '@tanstack/react-query';
import { gigsApi } from '../../../api/gigs.api';

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