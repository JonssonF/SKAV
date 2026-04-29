import { useQuery } from '@tanstack/react-query';
import { albumsApi } from '../../../api/albums.api';

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
    enabled: id > 0, // Kör inte om id är 0 eller ogiltigt
  });
}