import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useAlbums, useCreateAlbum, useUpdateAlbum, useDeleteAlbum } from './useAlbums';
import { getApiErrors } from '../../../utils/getApiErrors';
import type { AlbumResponse, CreateAlbumRequest, UpdateAlbumRequest } from '../../../types/album.types';

export function useAdminAlbums() {
  const { data: albums = [], isLoading, error } = useAlbums();

  const [createOpened, setCreateOpened] = useState(false);
  const [editAlbum, setEditAlbum] = useState<AlbumResponse | null>(null);
  const [createErrors, setCreateErrors] = useState<Record<string, string> | null>(null);
  const [editErrors, setEditErrors] = useState<Record<string, string> | null>(null);

  const createMutation = useCreateAlbum();
  const updateMutation = useUpdateAlbum();
  const deleteMutation = useDeleteAlbum();

  const handleCreate = (data: CreateAlbumRequest) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setCreateOpened(false);
        setCreateErrors(null);
        notifications.show({ title: 'Album skapat', message: 'Albumet har skapats.', color: 'green' });
      },
      onError: (err) => setCreateErrors(getApiErrors(err)),
    });
  };

  const handleUpdate = (data: UpdateAlbumRequest) => {
    if (!editAlbum) return;
    updateMutation.mutate({ id: editAlbum.id, data }, {
      onSuccess: () => {
        setEditAlbum(null);
        setEditErrors(null);
        notifications.show({ title: 'Album uppdaterat', message: 'Albumet har uppdaterats.', color: 'green' });
      },
      onError: (err) => setEditErrors(getApiErrors(err)),
    });
  };

  const handleDelete = (album: AlbumResponse) => {
    if (window.confirm(`Vill du ta bort "${album.title}"?`)) {
      deleteMutation.mutate(album.id, {
        onSuccess: () => {
          notifications.show({ title: 'Album borttaget', message: 'Albumet har tagits bort.', color: 'green' });
        },
        onError: () => {
          notifications.show({ title: 'Fel', message: 'Kunde inte ta bort albumet.', color: 'red' });
        },
      });
    }
  };

  return {
    albums,
    isLoading,
    error,
    deleteLoading: deleteMutation.isPending,

    openCreate: () => {
      setCreateErrors(null);
      setCreateOpened(true);
    },
    openEdit: (album: AlbumResponse) => {
      setEditErrors(null);
      setEditAlbum(album);
    },
    handleDelete,

    createModal: {
      opened: createOpened,
      onClose: () => setCreateOpened(false),
      onSubmit: handleCreate,
      loading: createMutation.isPending,
      errors: createErrors,
    },
    editModal: {
      opened: !!editAlbum,
      onClose: () => setEditAlbum(null),
      album: editAlbum,
      onSubmit: handleUpdate,
      loading: updateMutation.isPending,
      errors: editErrors,
    },
  };
}