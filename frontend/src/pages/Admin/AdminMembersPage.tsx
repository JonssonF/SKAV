import { Container, Title, Button, Group, Loader, Alert } from '@mantine/core';
import { useAdminMembers } from '../../features/members/hooks/useAdminMembers';
import { MembersTable } from '../../features/members/components/MembersTable';
import { MemberCreateModal } from '../../features/members/components/MemberCreateModal';
import { MemberEditModal } from '../../features/members/components/MemberEditModal';

export function AdminMembersPage() {
  const admin = useAdminMembers();

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
          Kunde inte hämta medlemmar.
        </Alert>
      </Container>
    );
  }

  return (
    <Container py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Hantera medlemmar</Title>
        <Button onClick={admin.openCreate}>Ny medlem</Button>
      </Group>

      <MembersTable
        members={admin.members}
        onEdit={admin.openEdit}
        onDelete={admin.handleDelete}
        deleteLoading={admin.deleteLoading}
      />

      <MemberCreateModal {...admin.createModal} />
      <MemberEditModal {...admin.editModal} />
    </Container>
  );
}