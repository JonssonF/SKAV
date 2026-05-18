import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { albumsApi } from '../../../api/albums.api';
import type { CreateAlbumRequest, UpdateAlbumRequest } from '../../../types/album.types';

export function useAlbums() {
  return useQuery({
    queryKey: ['albums'],
    queryFn: albumsApi.getAll,
  });
}

export function useAlbum(id: number) {
  return useQuery({
    queryKey: ['albums', id],
    queryFn: () => albumsApi.getById(id),
    enabled: id > 0,
  });
}

export function useCreateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAlbumRequest) => albumsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });
}

export function useUpdateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAlbumRequest }) =>
      albumsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });
}

export function useDeleteAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => albumsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });
}