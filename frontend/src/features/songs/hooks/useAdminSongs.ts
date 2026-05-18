import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useSongs, useCreateSong, useUpdateSong, useDeleteSong } from './useSongs';
import { useCreateLyrics, useUpdateLyrics } from '../../lyrics/hooks/useLyrics';
import { lyricsApi } from '../../../api/lyrics.api';
import { getApiErrors, getApiMessage } from '../../../utils/getApiErrors';
import type { SongResponse, CreateSongRequest, UpdateSongRequest } from '../../../types/song.types';
import type { LyricsResponse } from '../../../types/lyrics.types';

export function useAdminSongs() {
  const { data: songs, isLoading, error } = useSongs();

  const createSong = useCreateSong();
  const updateSong = useUpdateSong();
  const deleteSong = useDeleteSong();
  const createLyrics = useCreateLyrics();
  const updateLyrics = useUpdateLyrics();

  // Create modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [createErrors, setCreateErrors] = useState<Record<string, string> | null>(null);

  // Edit modal state
  const [editSong, setEditSong] = useState<SongResponse | null>(null);
  const [editErrors, setEditErrors] = useState<Record<string, string> | null>(null);

  // Lyrics modal state
  const [lyricsSong, setLyricsSong] = useState<SongResponse | null>(null);
  const [existingLyrics, setExistingLyrics] = useState<LyricsResponse | null>(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);

  // --- Create ---
  const openCreate = () => {
    setCreateErrors(null);
    setCreateOpen(true);
  };

  const closeCreate = () => {
    setCreateOpen(false);
    setCreateErrors(null);
  };

  const handleCreate = (data: CreateSongRequest) => {
    setCreateErrors(null);
    createSong.mutate(data, {
      onSuccess: () => {
        closeCreate();
        notifications.show({
          title: 'Låt skapad',
          message: 'Den nya låten har lagts till.',
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
  const openEdit = (song: SongResponse) => {
    setEditErrors(null);
    setEditSong(song);
  };

  const closeEdit = () => {
    setEditSong(null);
    setEditErrors(null);
  };

  const handleUpdate = (data: UpdateSongRequest) => {
    if (!editSong) return;
    setEditErrors(null);
    updateSong.mutate(
      { id: editSong.id, data },
      {
        onSuccess: () => {
          closeEdit();
          notifications.show({
            title: 'Låt uppdaterad',
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
  const handleDelete = (song: SongResponse) => {
    if (!window.confirm(`Vill du ta bort "${song.title}"?`)) return;
    deleteSong.mutate(song.id, {
      onSuccess: () => {
        notifications.show({
          title: 'Låt borttagen',
          message: `"${song.title}" har tagits bort.`,
          color: 'green',
        });
      },
      onError: (err) => {
        notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
      },
    });
  };

  // --- Lyrics ---
  const openLyrics = async (song: SongResponse) => {
    setLyricsSong(song);
    setExistingLyrics(null);
    setLyricsLoading(true);

    try {
      const data = await lyricsApi.getBySongId(song.id);
      setExistingLyrics(data);
    } catch {
      setExistingLyrics(null);
    } finally {
      setLyricsLoading(false);
    }
  };

  const closeLyrics = () => {
    setLyricsSong(null);
  };

  const handleLyricsSubmit = (body: string) => {
    if (!lyricsSong) return;

    if (existingLyrics) {
      updateLyrics.mutate(
        { id: existingLyrics.id, data: { songId: lyricsSong.id, body } },
        {
          onSuccess: () => {
            closeLyrics();
            notifications.show({
              title: 'Låttext uppdaterad',
              message: `Texten för "${lyricsSong.title}" har sparats.`,
              color: 'green',
            });
          },
          onError: (err) => {
            notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
          },
        }
      );
    } else {
      createLyrics.mutate(
        { songId: lyricsSong.id, body },
        {
          onSuccess: () => {
            closeLyrics();
            notifications.show({
              title: 'Låttext sparad',
              message: `Texten för "${lyricsSong.title}" har lagts till.`,
              color: 'green',
            });
          },
          onError: (err) => {
            notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
          },
        }
      );
    }
  };

  return {
    songs: songs ?? [],
    isLoading,
    error,

    createModal: {
      opened: createOpen,
      onClose: closeCreate,
      onSubmit: handleCreate,
      loading: createSong.isPending,
      errors: createErrors,
    },

    editModal: {
      song: editSong,
      onClose: closeEdit,
      onSubmit: handleUpdate,
      loading: updateSong.isPending,
      errors: editErrors,
    },

    lyricsModal: {
      song: lyricsSong,
      existingLyrics,
      lyricsLoading,
      onClose: closeLyrics,
      onSubmit: handleLyricsSubmit,
      saving: createLyrics.isPending || updateLyrics.isPending,
    },

    openCreate,
    openEdit,
    handleDelete,
    openLyrics,
    deleteLoading: deleteSong.isPending,
  };
}