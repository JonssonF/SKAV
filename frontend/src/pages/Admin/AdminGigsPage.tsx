import { Container, Title, Button, Group, Loader, Alert } from '@mantine/core';
import { useAdminGigs } from '../../features/gigs/hooks/useAdminGigs';
import { GigsTable } from '../../features/gigs/components/GigsTable';
import { GigCreateModal } from '../../features/gigs/components/GigCreateModal';
import { GigEditModal } from '../../features/gigs/components/GigEditModal';

export function AdminGigsPage() {
  const admin = useAdminGigs();

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
          Kunde inte hämta spelningar.
        </Alert>
      </Container>
    );
  }

  return (
    <Container py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Hantera spelningar</Title>
        <Button onClick={admin.openCreate}>Ny spelning</Button>
      </Group>

      <GigsTable
        gigs={admin.gigs}
        onEdit={admin.openEdit}
        onDelete={admin.handleDelete}
        deleteLoading={admin.deleteLoading}
      />

      <GigCreateModal {...admin.createModal} />
      <GigEditModal {...admin.editModal} />
    </Container>
  );
}