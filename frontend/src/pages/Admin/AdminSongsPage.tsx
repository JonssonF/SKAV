import { useState } from 'react';
import {
  Container,
  Title,
  Button,
  Modal,
  Table,
  Group,
  Text,
  Alert,
  Loader,
  Badge,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useSongs, useCreateSong, useUpdateSong, useDeleteSong } from '../../features/songs/hooks/useSongs';
import { useAlbums } from '../../features/albums/hooks/useAlbums';
import { SongForm } from '../../features/songs/components/SongForm';
import { getApiErrors, getApiMessage } from '../../utils/getApiErrors';
import type { SongResponse } from '../../types/song.types';
import { useCreateLyrics, useUpdateLyrics } from '../../features/lyrics/hooks/useLyrics';
import { LyricsForm } from '../../features/lyrics/components/LyricsForm';
import type { LyricsResponse } from '../../types/lyrics.types';

function formatDuration(seconds?: number): string {
  if (!seconds) return '-';
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export function AdminSongsPage() {
  const { data: songs, isLoading, error } = useSongs();
  const { data: albums } = useAlbums();
  const createSong = useCreateSong();
  const updateSong = useUpdateSong();
  const deleteSong = useDeleteSong();

  const [createOpen, setCreateOpen] = useState(false);
  const [editSong, setEditSong] = useState<SongResponse | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string> | null>(null);
  const createLyrics = useCreateLyrics();
  const updateLyrics = useUpdateLyrics();
  const [lyricsSong, setLyricsSong] = useState<SongResponse | null>(null);
  const [existingLyrics, setExistingLyrics] = useState<LyricsResponse | null>(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);

  // Hjälpfunktion — hitta albumtitel från ID
  const getAlbumTitle = (albumId?: number) => {
    if (!albumId) return null;
    return albums?.find((a) => a.id === albumId)?.title ?? null;
  };

  const handleCreate = (data: Parameters<typeof createSong.mutate>[0]) => {
    setFormErrors(null);
    createSong.mutate(data, {
      onSuccess: () => {
        setCreateOpen(false);
        notifications.show({
          title: 'Låt skapad',
          message: 'Den nya låten har lagts till.',
          color: 'green',
        });
      },
      onError: (err) => {
        const fieldErrors = getApiErrors(err);
        if (fieldErrors) {
          setFormErrors(fieldErrors);
        } else {
          notifications.show({
            title: 'Något gick fel',
            message: getApiMessage(err),
            color: 'red',
          });
        }
      },
    });
  };

  const handleUpdate = (data: Parameters<typeof updateSong.mutate>[0]['data']) => {
    if (!editSong) return;
    setFormErrors(null);
    updateSong.mutate(
      { id: editSong.id, data },
      {
        onSuccess: () => {
          setEditSong(null);
          notifications.show({
            title: 'Låt uppdaterad',
            message: 'Ändringarna har sparats.',
            color: 'green',
          });
        },
        onError: (err) => {
          const fieldErrors = getApiErrors(err);
          if (fieldErrors) {
            setFormErrors(fieldErrors);
          } else {
            notifications.show({
              title: 'Något gick fel',
              message: getApiMessage(err),
              color: 'red',
            });
          }
        },
      }
    );
  };

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
        notifications.show({
          title: 'Något gick fel',
          message: getApiMessage(err),
          color: 'red',
        });
      },
    });
  };

  const handleOpenLyrics = async (song: SongResponse) => {
    setLyricsSong(song);
    setExistingLyrics(null);
    setLyricsLoading(true);

    // Försök hämta befintlig låttext via slug
    try {
      const slug = song.title
        .toLowerCase()
        .replace(/[åä]/g, 'a')
        .replace(/[ö]/g, 'o')
        .replace(/[é]/g, 'e')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const response = await fetch(`http://localhost:5249/api/lyrics/${slug}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExistingLyrics(data);
      }
    } catch {
      // Ingen befintlig låttext — det är ok
    } finally {
      setLyricsLoading(false);
    }
  };

  const handleLyricsSubmit = (body: string) => {
    if (!lyricsSong) return;

    if (existingLyrics) {
      // Uppdatera befintlig
      updateLyrics.mutate(
        { id: existingLyrics.id, data: { songId: lyricsSong.id, body } },
        {
          onSuccess: () => {
            setLyricsSong(null);
            notifications.show({
              title: 'Låttext uppdaterad',
              message: `Texten för "${lyricsSong.title}" har sparats.`,
              color: 'green',
            });
          },
          onError: (err) => {
            notifications.show({
              title: 'Något gick fel',
              message: getApiMessage(err),
              color: 'red',
            });
          },
        }
      );
    } else {
      // Skapa ny
      createLyrics.mutate(
        { songId: lyricsSong.id, body },
        {
          onSuccess: () => {
            setLyricsSong(null);
            notifications.show({
              title: 'Låttext sparad',
              message: `Texten för "${lyricsSong.title}" har lagts till.`,
              color: 'green',
            });
          },
          onError: (err) => {
            notifications.show({
              title: 'Något gick fel',
              message: getApiMessage(err),
              color: 'red',
            });
          },
        }
      );
    }
  };

  const handleCloseCreate = () => {
    setCreateOpen(false);
    setFormErrors(null);
  };

  const handleCloseEdit = () => {
    setEditSong(null);
    setFormErrors(null);
  };

  if (isLoading) {
    return (
      <Container py="xl">
        <Group justify="center"><Loader size="lg" /></Group>
      </Container>
    );
  }

  if (error) {
    return (
      <Container py="xl">
        <Alert color="red" title="Något gick fel">
          Kunde inte hämta låtar.
        </Alert>
      </Container>
    );
  }

  return (
    <Container py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Hantera låtar</Title>
        <Button onClick={() => setCreateOpen(true)}>Ny låt</Button>
      </Group>

      {!songs || songs.length === 0 ? (
        <Text c="dimmed">Inga låtar än. Skapa den första!</Text>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Titel</Table.Th>
              <Table.Th>Album</Table.Th>
              <Table.Th>Spår</Table.Th>
              <Table.Th>Längd</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {songs.map((song) => (
              <Table.Tr key={song.id}>
                <Table.Td>{song.title}</Table.Td>
                <Table.Td>
                  {getAlbumTitle(song.albumId) ?? (
                    <Badge variant="light" color="gray" size="sm">Singel</Badge>
                  )}
                </Table.Td>
                <Table.Td>{song.trackNumber ?? '-'}</Table.Td>
                <Table.Td>{formatDuration(song.durationSeconds)}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Button
                      variant="light"
                      color="violet"
                      size="xs"
                      onClick={() => handleOpenLyrics(song)}
                    >
                      Låttext
                    </Button>
                    <Button
                      variant="light"
                      size="xs"
                      onClick={() => setEditSong(song)}
                    >
                      Redigera
                    </Button>
                    <Button
                      variant="light"
                      color="red"
                      size="xs"
                      onClick={() => handleDelete(song)}
                      loading={deleteSong.isPending}
                    >
                      Ta bort
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <Modal
        opened={createOpen}
        onClose={handleCloseCreate}
        title="Ny låt"
        size="lg"
      >
        <SongForm
          onSubmit={handleCreate}
          loading={createSong.isPending}
          errors={formErrors}
        />
      </Modal>

      <Modal
        opened={editSong !== null}
        onClose={handleCloseEdit}
        title="Redigera låt"
        size="lg"
      >
        {editSong && (
          <SongForm
            initialData={editSong}
            onSubmit={handleUpdate}
            loading={updateSong.isPending}
            errors={formErrors}
          />
        )}
      </Modal>
            <Modal
        opened={lyricsSong !== null}
        onClose={() => setLyricsSong(null)}
        title={lyricsSong ? `Låttext — ${lyricsSong.title}` : 'Låttext'}
        size="lg"
      >
        {lyricsLoading ? (
          <Group justify="center" py="xl"><Loader /></Group>
        ) : (
          lyricsSong && (
            <LyricsForm
              songId={lyricsSong.id}
              initialData={existingLyrics}
              onSubmit={handleLyricsSubmit}
              loading={createLyrics.isPending || updateLyrics.isPending}
            />
          )
        )}
      </Modal>
    </Container>
  );
}