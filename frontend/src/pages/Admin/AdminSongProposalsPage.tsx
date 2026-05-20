import { Container, Title, Button, Group, Loader, Alert } from '@mantine/core';
import { useAdminSongProposals } from '../../features/songProposals/hooks/useAdminSongProposals';
import { SongProposalsTable } from '../../features/songProposals/components/SongProposalsTable';
import { SongProposalCreateModal } from '../../features/songProposals/components/SongProposalCreateModal';
import { SongProposalEditModal } from '../../features/songProposals/components/SongProposalEditModal';

export function AdminSongProposalsPage() {
  const admin = useAdminSongProposals();

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
          Kunde inte hämta låtförslag.
        </Alert>
      </Container>
    );
  }

  return (
    <Container py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Hantera låtförslag</Title>
        <Group>
          <Button color="red" variant="outline" onClick={admin.handleResetVotes} loading={admin.resetLoading}>
            Nollställ röster
          </Button>
          <Button onClick={admin.openCreate}>Nytt förslag</Button>
        </Group>
      </Group>

      <SongProposalsTable
        proposals={admin.proposals}
        onEdit={admin.openEdit}
        onDelete={admin.handleDelete}
        onSetWinner={admin.handleSetWinner}
        deleteLoading={admin.deleteLoading}
        winnerLoading={admin.winnerLoading}
      />

      <SongProposalCreateModal {...admin.createModal} />
      <SongProposalEditModal {...admin.editModal} />
    </Container>
  );
}