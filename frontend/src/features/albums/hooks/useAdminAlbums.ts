import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useAlbums, useCreateAlbum, useUpdateAlbum, useDeleteAlbum } from './useAlbums';
import { getApiErrors, getApiMessage } from '../../../utils/getApiErrors';
import type { AlbumResponse, CreateAlbumRequest, UpdateAlbumRequest } from '../../../types/album.types';

export function useAdminAlbums() {
  const { data: albums, isLoading, error } = useAlbums();
  const createAlbum = useCreateAlbum();
  const updateAlbum = useUpdateAlbum();
  const deleteAlbum = useDeleteAlbum();

  // Create modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [createErrors, setCreateErrors] = useState<Record<string, string> | null>(null);

  // Edit modal state
  const [editAlbum, setEditAlbum] = useState<AlbumResponse | null>(null);
  const [editErrors, setEditErrors] = useState<Record<string, string> | null>(null);

  // --- Create ---
  const openCreate = () => {
    setCreateErrors(null);
    setCreateOpen(true);
  };

  const closeCreate = () => {
    setCreateOpen(false);
    setCreateErrors(null);
  };

  const handleCreate = (data: CreateAlbumRequest) => {
    setCreateErrors(null);
    createAlbum.mutate(data, {
      onSuccess: () => {
        closeCreate();
        notifications.show({
          title: 'Album skapat',
          message: 'Det nya albumet har lagts till.',
          color: 'green',
        });
      },
      onError: (err) => {
        const fieldErrors = getApiErrors(err);
        if (fieldErrors) {
          setCreateErrors(fieldErrors);
        } else {
          notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
        }
      },
    });
  };

  // --- Edit ---
  const openEdit = (album: AlbumResponse) => {
    setEditErrors(null);
    setEditAlbum(album);
  };

  const closeEdit = () => {
    setEditAlbum(null);
    setEditErrors(null);
  };

  const handleUpdate = (data: UpdateAlbumRequest) => {
    if (!editAlbum) return;
    setEditErrors(null);
    updateAlbum.mutate(
      { id: editAlbum.id, data },
      {
        onSuccess: () => {
          closeEdit();
          notifications.show({
            title: 'Album uppdaterat',
            message: 'Ändringarna har sparats.',
            color: 'green',
          });
        },
        onError: (err) => {
          const fieldErrors = getApiErrors(err);
          if (fieldErrors) {
            setEditErrors(fieldErrors);
          } else {
            notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
          }
        },
      }
    );
  };

  // --- Delete ---
  const handleDelete = (album: AlbumResponse) => {
    if (!window.confirm(`Vill du ta bort "${album.title}"?`)) return;
    deleteAlbum.mutate(album.id, {
      onSuccess: () => {
        notifications.show({
          title: 'Album borttaget',
          message: `"${album.title}" har tagits bort.`,
          color: 'green',
        });
      },
      onError: (err) => {
        notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
      },
    });
  };

  return {
    albums: albums ?? [],
    isLoading,
    error,

    createModal: {
      opened: createOpen,
      onClose: closeCreate,
      onSubmit: handleCreate,
      loading: createAlbum.isPending,
      errors: createErrors,
    },

    editModal: {
      album: editAlbum,
      onClose: closeEdit,
      onSubmit: handleUpdate,
      loading: updateAlbum.isPending,
      errors: editErrors,
    },

    openCreate,
    openEdit,
    handleDelete,
    deleteLoading: deleteAlbum.isPending,
  };
}