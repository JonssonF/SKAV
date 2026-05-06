import { Table, Group, Button, Text, Badge, Select } from '@mantine/core';
import type { UserResponse, UpdateUserRoleRequest } from '../../../types/user.types';
import { getRoleLabel } from '../../../types/user.types';

interface UsersTableProps {
  users: UserResponse[];
  currentUserId?: number;
  currentUserRoles?: string[];
  onUpdateRole: (user: UserResponse, data: UpdateUserRoleRequest) => void;
  onDelete: (user: UserResponse) => void;
  deleteLoading?: boolean;
  roleLoading?: boolean;
}

function getRoleBadgeColor(role: number): string {
  switch (role) {
    case 1: return 'red';
    case 2: return 'blue';
    case 4: return 'gray';
    default: return 'gray';
  }
}

function getRoleOptions(currentUserRoles: string[], targetUserRole: number, isSelf: boolean) {
  const isAdmin = currentUserRoles.includes('Admin');
  const isEditor = currentUserRoles.includes('Editor');

  // Member kan inte ändra roller
  if (!isAdmin && !isEditor) return [];

  // Ingen ändrar sin egen roll (utom Editor som demoterar sig)
  if (isSelf && isEditor) {
    return [
      { value: '2', label: 'Editor' },
      { value: '4', label: 'Member' },
    ];
  }

  // Admin kan inte ändra sig själv
  if (isSelf) return [];

  // Editor kan bara ändra Members
  if (isEditor && !isAdmin) {
    if (targetUserRole !== 4) return [];
    return [
      { value: '2', label: 'Editor' },
      { value: '4', label: 'Member' },
    ];
  }

  // Admin kan sätta alla roller
  return [
    { value: '1', label: 'Admin' },
    { value: '2', label: 'Editor' },
    { value: '4', label: 'Member' },
  ];
}

export function UsersTable({
  users,
  currentUserId,
  currentUserRoles,
  onUpdateRole,
  onDelete,
  deleteLoading,
  roleLoading,
}: UsersTableProps) {
  if (users.length === 0) {
    return <Text c="dimmed">Inga användare hittades.</Text>;
  }

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>E-post</Table.Th>
          <Table.Th>Roll</Table.Th>
          <Table.Th>Ändra roll</Table.Th>
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {users.map((user) => {
            const isSelf = user.id === currentUserId;
            const roleOptions = getRoleOptions(currentUserRoles ?? [], user.roles, isSelf);
            const canChangeRole = roleOptions.length > 0;
            const canDelete = !isSelf && (currentUserRoles?.includes('Admin') ?? false);

          return (
            <Table.Tr key={user.id}>
              <Table.Td>
                <Group gap="sm">
                  <Text size="sm">{user.email}</Text>
                  {isSelf && (
                    <Badge variant="light" size="xs">Du</Badge>
                  )}
                </Group>
              </Table.Td>
              <Table.Td>
                <Badge color={getRoleBadgeColor(user.roles)} variant="light">
                  {getRoleLabel(user.roles)}
                </Badge>
              </Table.Td>
              <Table.Td>
                {canChangeRole ? (
                  <Select
                    size="xs"
                    data={roleOptions}
                    value={String(user.roles)}
                    onChange={(val) => {
                      if (val) {
                        onUpdateRole(user, { roles: Number(val) });
                      }
                    }}
                    disabled={roleLoading}
                    w={120}
                  />
                ) : (
                  <Text size="xs" c="dimmed">–</Text>
                )}
              </Table.Td>
              <Table.Td>
                {canDelete ? (
                  <Button
                    variant="light"
                    color="red"
                    size="xs"
                    onClick={() => onDelete(user)}
                    loading={deleteLoading}
                  >
                    Ta bort
                  </Button>
                ) : null}
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
}