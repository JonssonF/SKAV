import { Container, Title, Button, Group, Loader, Alert } from '@mantine/core';
import { useAdminAlbums } from '../../features/albums/hooks/useAdminAlbums';
import { AlbumsTable } from '../../features/albums/components/AlbumsTable';
import { AlbumCreateModal } from '../../features/albums/components/AlbumCreateModal';
import { AlbumEditModal } from '../../features/albums/components/AlbumEditModal';

export function AdminAlbumPage() {
  const admin = useAdminAlbums();

  if (admin.isLoading) {
    return (
      <Container py="xl">
        <Group justify="center"><Loader size="lg" /></Group>
      </Container>
    );
  }

  if (admin.error) {
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
        <Button onClick={admin.openCreate}>Nytt album</Button>
      </Group>

      <AlbumsTable
        albums={admin.albums}
        onEdit={admin.openEdit}
        onDelete={admin.handleDelete}
        deleteLoading={admin.deleteLoading}
      />

      <AlbumCreateModal {...admin.createModal} />
      <AlbumEditModal {...admin.editModal} />
    </Container>
  );
}