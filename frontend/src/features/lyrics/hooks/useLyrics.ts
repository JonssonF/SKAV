import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lyricsApi } from '../../../api/lyrics.api';
import type { CreateLyricsRequest, UpdateLyricsRequest } from '../../../types/lyrics.types';

export function useLyricsBySlug(slug: string) {
  return useQuery({
    queryKey: ['lyrics', slug],
    queryFn: () => lyricsApi.getBySlug(slug),
    enabled: slug.length > 0, // Kör inte om slug är tom
  });
}

export function useCreateLyrics() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLyricsRequest) => lyricsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lyrics'] });
    },
  });
}

export function useUpdateLyrics() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLyricsRequest }) =>
      lyricsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lyrics'] });
    },
  });
}

export function useDeleteLyrics() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => lyricsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lyrics'] });
    },
  });
}