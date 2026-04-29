import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { songsApi } from '../../../api/songs.api';
import type { CreateSongRequest, UpdateSongRequest } from '../../../types/song.types';

export function useSongs() {
  return useQuery({
    queryKey: ['songs'],
    queryFn: songsApi.getAll,
  });
}

export function useCreateSong() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSongRequest) => songsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
    },
  });
}

export function useUpdateSong() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSongRequest }) =>
      songsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
    },
  });
}

export function useDeleteSong() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => songsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
    },
  });
}