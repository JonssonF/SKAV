import { Table, Group, Button, Text, Badge, Select } from '@mantine/core';
import type { UserResponse, UpdateUserRoleRequest } from '../../../types/user.types';
import { getRoleLabel } from '../../../types/user.types';

interface UsersTableProps {
  users: UserResponse[];
  currentUserId?: number;
  onUpdateRole: (user: UserResponse, data: UpdateUserRoleRequest) => void;
  onDelete: (user: UserResponse) => void;
  deleteLoading?: boolean;
  roleLoading?: boolean;
}

const roleOptions = [
  { value: '4', label: 'Member' },
  { value: '2', label: 'Editor' },
  { value: '1', label: 'Admin' },
];

function getRoleBadgeColor(role: number): string {
  switch (role) {
    case 1: return 'red';
    case 2: return 'blue';
    case 4: return 'gray';
    default: return 'gray';
  }
}

export function UsersTable({
  users,
  currentUserId,
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
          const isCurrentUser = user.id === currentUserId;

          return (
            <Table.Tr key={user.id}>
              <Table.Td>
                <Group gap="sm">
                  <Text size="sm">{user.email}</Text>
                  {isCurrentUser && (
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
                <Select
                  size="xs"
                  data={roleOptions}
                  value={String(user.roles)}
                  onChange={(val) => {
                    if (val) {
                      onUpdateRole(user, { roles: Number(val) });
                    }
                  }}
                  disabled={isCurrentUser || roleLoading}
                  w={120}
                />
              </Table.Td>
              <Table.Td>
                <Button
                  variant="light"
                  color="red"
                  size="xs"
                  onClick={() => onDelete(user)}
                  loading={deleteLoading}
                  disabled={isCurrentUser}
                >
                  Ta bort
                </Button>
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
}