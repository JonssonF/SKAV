import { Container, Title, Button, Group, Loader, Alert } from '@mantine/core';
import { useAdminSongs } from '../../features/songs/hooks/useAdminSongs';
import { SongsTable } from '../../features/songs/components/SongsTable';
import { SongCreateModal } from '../../features/songs/components/SongCreateModal';
import { SongEditModal } from '../../features/songs/components/SongEditModal';
import { LyricsModal } from '../../features/lyrics/components/LyricsModal';

export function AdminSongsPage() {
  const admin = useAdminSongs();

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
          Kunde inte hämta låtar.
        </Alert>
      </Container>
    );
  }

  return (
    <Container py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Hantera låtar</Title>
        <Button onClick={admin.openCreate}>Ny låt</Button>
      </Group>

      <SongsTable
        songs={admin.songs}
        albums={admin.albums}
        onEdit={admin.openEdit}
        onDelete={admin.handleDelete}
        onLyrics={admin.openLyrics}
        deleteLoading={admin.deleteLoading}
      />

      <SongCreateModal {...admin.createModal} />
      <SongEditModal {...admin.editModal} />
      <LyricsModal {...admin.lyricsModal} />
    </Container>
  );
}