import { Container, Title, Button, Group, Loader, Alert } from '@mantine/core';
import { useAdminUsers } from '../../features/users/hooks/useAdminUsers';
import { useAuth } from '../../providers/AuthProvider';
import { UsersTable } from '../../features/users/components/UsersTable';
import { UserCreateModal } from '../../features/users/components/UserCreateModal';
import { ChangePasswordModal } from '../../features/users/components/ChangePasswordModal';


export function AdminUsersPage() {
  const admin = useAdminUsers();
  const { user } = useAuth();

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
          Kunde inte hämta användare.
        </Alert>
      </Container>
    );
  }

  return (
    <Container py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Hantera användare</Title>
        <Button onClick={admin.openCreate}>Ny användare</Button>
      </Group>

        <UsersTable
        users={admin.users}
        currentUserId={user?.userId}
        currentUserRoles={user?.roles}
        onUpdateRole={admin.handleUpdateRole}
        onDelete={admin.handleDelete}
        onChangePassword={admin.openChangePassword}
        deleteLoading={admin.deleteLoading}
        roleLoading={admin.roleLoading}
        />

      <UserCreateModal {...admin.createModal} />
      <ChangePasswordModal {...admin.passwordModal} />
    </Container>
  );
}