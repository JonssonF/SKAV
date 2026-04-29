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
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useAlbums, useCreateAlbum, useUpdateAlbum, useDeleteAlbum } from '../../features/albums/hooks/useAlbums';
import { AlbumForm } from '../../features/albums/components/AlbumForm';
import { getApiErrors, getApiMessage } from '../../utils/getApiErrors';
import type { AlbumResponse } from '../../types/album.types';

export function AdminAlbumPage() {
  const { data: albums, isLoading, error } = useAlbums();
  const createAlbum = useCreateAlbum();
  const updateAlbum = useUpdateAlbum();
  const deleteAlbum = useDeleteAlbum();

  const [createOpen, setCreateOpen] = useState(false);
  const [editAlbum, setEditAlbum] = useState<AlbumResponse | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string> | null>(null);

  const handleCreate = (data: Parameters<typeof createAlbum.mutate>[0]) => {
    setFormErrors(null);
    createAlbum.mutate(data, {
      onSuccess: () => {
        setCreateOpen(false);
        notifications.show({
          title: 'Album skapat',
          message: 'Det nya albumet har lagts till.',
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

  const handleUpdate = (data: Parameters<typeof updateAlbum.mutate>[0]['data']) => {
    if (!editAlbum) return;
    setFormErrors(null);
    updateAlbum.mutate(
      { id: editAlbum.id, data },
      {
        onSuccess: () => {
          setEditAlbum(null);
          notifications.show({
            title: 'Album uppdaterat',
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
        notifications.show({
          title: 'Något gick fel',
          message: getApiMessage(err),
          color: 'red',
        });
      },
    });
  };

  const handleCloseCreate = () => {
    setCreateOpen(false);
    setFormErrors(null);
  };

  const handleCloseEdit = () => {
    setEditAlbum(null);
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
          Kunde inte hämta album.
        </Alert>
      </Container>
    );
  }

  return (
    <Container py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Hantera album</Title>
        <Button onClick={() => setCreateOpen(true)}>Nytt album</Button>
      </Group>

      {!albums || albums.length === 0 ? (
        <Text c="dimmed">Inga album än. Skapa det första!</Text>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Titel</Table.Th>
              <Table.Th>Releasedatum</Table.Th>
              <Table.Th>Beskrivning</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {albums.map((album) => (
              <Table.Tr key={album.id}>
                <Table.Td>{album.title}</Table.Td>
                <Table.Td>
                  {album.releaseDate
                    ? new Date(album.releaseDate).toLocaleDateString('sv-SE')
                    : '-'}
                </Table.Td>
                <Table.Td>{album.description ?? '-'}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Button
                      variant="light"
                      size="xs"
                      onClick={() => setEditAlbum(album)}
                    >
                      Redigera
                    </Button>
                    <Button
                      variant="light"
                      color="red"
                      size="xs"
                      onClick={() => handleDelete(album)}
                      loading={deleteAlbum.isPending}
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
        title="Nytt album"
        size="lg"
      >
        <AlbumForm
          onSubmit={handleCreate}
          loading={createAlbum.isPending}
          errors={formErrors}
        />
      </Modal>

      <Modal
        opened={editAlbum !== null}
        onClose={handleCloseEdit}
        title="Redigera album"
        size="lg"
      >
        {editAlbum && (
          <AlbumForm
            initialData={editAlbum}
            onSubmit={handleUpdate}
            loading={updateAlbum.isPending}
            errors={formErrors}
          />
        )}
      </Modal>
    </Container>
  );
}