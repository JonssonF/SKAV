import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useGigs, useCreateGig, useUpdateGig, useDeleteGig } from './useGigs';
import { getApiErrors, getApiMessage } from '../../../utils/getApiErrors';
import type { GigResponse, CreateGigRequest, UpdateGigRequest } from '../../../types/gig.types';

export function useAdminGigs() {
  const { data: gigs, isLoading, error } = useGigs();
  const createGig = useCreateGig();
  const updateGig = useUpdateGig();
  const deleteGig = useDeleteGig();

  // Create modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [createErrors, setCreateErrors] = useState<Record<string, string> | null>(null);

  // Edit modal state
  const [editGig, setEditGig] = useState<GigResponse | null>(null);
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

  const handleCreate = (data: CreateGigRequest) => {
    setCreateErrors(null);
    createGig.mutate(data, {
      onSuccess: () => {
        closeCreate();
        notifications.show({
          title: 'Spelning skapad',
          message: 'Den nya spelningen har lagts till.',
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
  const openEdit = (gig: GigResponse) => {
    setEditErrors(null);
    setEditGig(gig);
  };

  const closeEdit = () => {
    setEditGig(null);
    setEditErrors(null);
  };

  const handleUpdate = (data: UpdateGigRequest) => {
    if (!editGig) return;
    setEditErrors(null);
    updateGig.mutate(
      { id: editGig.id, data },
      {
        onSuccess: () => {
          closeEdit();
          notifications.show({
            title: 'Spelning uppdaterad',
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
  const handleDelete = (gig: GigResponse) => {
    if (!window.confirm(`Vill du ta bort "${gig.title}"?`)) return;
    deleteGig.mutate(gig.id, {
      onSuccess: () => {
        notifications.show({
          title: 'Spelning borttagen',
          message: `"${gig.title}" har tagits bort.`,
          color: 'green',
        });
      },
      onError: (err) => {
        notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
      },
    });
  };

  return {
    gigs: gigs ?? [],
    isLoading,
    error,

    createModal: {
      opened: createOpen,
      onClose: closeCreate,
      onSubmit: handleCreate,
      loading: createGig.isPending,
      errors: createErrors,
    },

    editModal: {
      gig: editGig,
      onClose: closeEdit,
      onSubmit: handleUpdate,
      loading: updateGig.isPending,
      errors: editErrors,
    },

    openCreate,
    openEdit,
    handleDelete,
    deleteLoading: deleteGig.isPending,
  };
}