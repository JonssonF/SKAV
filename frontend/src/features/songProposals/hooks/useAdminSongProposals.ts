import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import {
  useSongProposals,
  useCreateSongProposal,
  useUpdateSongProposal,
  useDeleteSongProposal,
  useSetWinner,
  useResetVotes,
} from './useSongProposals';
import { getApiErrors, getApiMessage } from '../../../utils/getApiErrors';
import type {
  SongProposalResponse,
  CreateSongProposalRequest,
  UpdateSongProposalRequest,
} from '../../../types/songProposal.types';

export function useAdminSongProposals() {
  const { data: proposals, isLoading, error } = useSongProposals();

  const createProposal = useCreateSongProposal();
  const updateProposal = useUpdateSongProposal();
  const deleteProposal = useDeleteSongProposal();
  const setWinner = useSetWinner();
  const resetVotes = useResetVotes();

  // Create modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [createErrors, setCreateErrors] = useState<Record<string, string> | null>(null);

  // Edit modal state
  const [editProposal, setEditProposal] = useState<SongProposalResponse | null>(null);
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

  const handleCreate = (data: CreateSongProposalRequest) => {
    setCreateErrors(null);
    createProposal.mutate(data, {
      onSuccess: () => {
        closeCreate();
        notifications.show({
          title: 'Förslag skapat',
          message: 'Det nya låtförslaget har lagts till.',
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
  const openEdit = (proposal: SongProposalResponse) => {
    setEditErrors(null);
    setEditProposal(proposal);
  };

  const closeEdit = () => {
    setEditProposal(null);
    setEditErrors(null);
  };

  const handleUpdate = (data: UpdateSongProposalRequest) => {
    if (!editProposal) return;
    setEditErrors(null);
    updateProposal.mutate(
      { id: editProposal.id, data },
      {
        onSuccess: () => {
          closeEdit();
          notifications.show({
            title: 'Förslag uppdaterat',
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
  const handleDelete = (proposal: SongProposalResponse) => {
    if (!window.confirm(`Vill du ta bort "${proposal.title}"?`)) return;
    deleteProposal.mutate(proposal.id, {
      onSuccess: () => {
        notifications.show({
          title: 'Förslag borttaget',
          message: `"${proposal.title}" har tagits bort.`,
          color: 'green',
        });
      },
      onError: (err) => {
        notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
      },
    });
  };

  // --- Set Winner ---
  const handleSetWinner = (proposal: SongProposalResponse) => {
    if (!window.confirm(`Vill du utse "${proposal.title}" till vinnare?`)) return;
    setWinner.mutate(proposal.id, {
      onSuccess: () => {
        notifications.show({
          title: 'Vinnare utsedd',
          message: `"${proposal.title}" har markerats som vinnare!`,
          color: 'green',
        });
      },
      onError: (err) => {
        notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
      },
    });
  };

  // --- Reset Votes ---
  const handleResetVotes = () => {
    if (!window.confirm('Vill du nollställa alla röster? Historik sparas.')) return;
    resetVotes.mutate(undefined, {
      onSuccess: () => {
        notifications.show({
          title: 'Röster nollställda',
          message: 'Alla röster har nollställts och historik har sparats.',
          color: 'green',
        });
      },
      onError: (err) => {
        notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
      },
    });
  };

  return {
    proposals: proposals ?? [],
    isLoading,
    error,

    createModal: {
      opened: createOpen,
      onClose: closeCreate,
      onSubmit: handleCreate,
      loading: createProposal.isPending,
      errors: createErrors,
    },

    editModal: {
      proposal: editProposal,
      onClose: closeEdit,
      onSubmit: handleUpdate,
      loading: updateProposal.isPending,
      errors: editErrors,
    },

    openCreate,
    openEdit,
    handleDelete,
    handleSetWinner,
    handleResetVotes,
    deleteLoading: deleteProposal.isPending,
    winnerLoading: setWinner.isPending,
    resetLoading: resetVotes.isPending,
  };
}