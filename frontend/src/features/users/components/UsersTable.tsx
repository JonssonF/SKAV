import { useMediaQuery } from '@mantine/hooks';
import { Table, Group, Button, Text, Badge, Select, Card, Stack, Divider } from '@mantine/core';
import type { UserResponse, UpdateUserRoleRequest } from '../../../types/user.types';
import { getRoleLabel } from '../../../types/user.types';

interface UsersTableProps {
  users: UserResponse[];
  currentUserId?: number;
  currentUserRoles?: string[];
  onUpdateRole: (user: UserResponse, data: UpdateUserRoleRequest) => void;
  onDelete: (user: UserResponse) => void;
  onChangePassword: () => void;
  onLinkMember: (user: UserResponse) => void;
  onUnlinkMember: (user: UserResponse) => void;
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

  if (!isAdmin && !isEditor) return [];

  if (isSelf && isEditor) {
    return [
      { value: '2', label: 'Editor' },
      { value: '4', label: 'Member' },
    ];
  }

  if (isSelf) return [];

  if (isEditor && !isAdmin) {
    if (targetUserRole !== 4) return [];
    return [
      { value: '2', label: 'Editor' },
      { value: '4', label: 'Member' },
    ];
  }

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
  onChangePassword,
  onLinkMember,
  onUnlinkMember,
  deleteLoading,
  roleLoading,
}: UsersTableProps) {
  const isMobile = useMediaQuery('(max-width: 48em)');
  const isAdmin = currentUserRoles?.includes('Admin') ?? false;

  if (users.length === 0) {
    return <Text c="dimmed">Inga användare hittades.</Text>;
  }

  // --- Mobilvy: ett kort per användare ---
  if (isMobile) {
    return (
      <Stack gap="sm">
        {users.map((user) => {
          const isSelf = user.id === currentUserId;
          const roleOptions = getRoleOptions(currentUserRoles ?? [], user.roles, isSelf);
          const canChangeRole = roleOptions.length > 0;
          const canDelete = !isSelf && isAdmin;

          return (
            <Card key={user.id} withBorder padding="sm">
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500}>{user.email}</Text>
                {isSelf && <Badge variant="light" size="xs">Du</Badge>}
              </Group>

              <Group justify="space-between" mb="xs">
                <Text size="xs" c="dimmed">Roll</Text>
                <Badge color={getRoleBadgeColor(user.roles)} variant="light">
                  {getRoleLabel(user.roles)}
                </Badge>
              </Group>

              <Group justify="space-between" mb="xs">
                <Text size="xs" c="dimmed">Bandmedlem</Text>
                {user.memberName ? (
                  <Group gap="xs">
                    <Text size="sm">{user.memberName}</Text>
                    {isAdmin && (
                      <Button variant="subtle" color="red" size="xs" onClick={() => onUnlinkMember(user)}>
                        Bryt
                      </Button>
                    )}
                  </Group>
                ) : (
                  isAdmin && (
                    <Button variant="subtle" size="xs" onClick={() => onLinkMember(user)}>
                      Koppla
                    </Button>
                  )
                )}
              </Group>

              {canChangeRole && (
                <Group justify="space-between" mb="xs">
                  <Text size="xs" c="dimmed">Ändra roll</Text>
                  <Select
                    size="xs"
                    data={roleOptions}
                    value={String(user.roles)}
                    onChange={(val) => {
                      if (val) onUpdateRole(user, { roles: Number(val) });
                    }}
                    disabled={roleLoading}
                    w={120}
                  />
                </Group>
              )}

              {(isSelf || canDelete) && (
                <>
                  <Divider my="xs" />
                  <Group gap="xs">
                    {isSelf && (
                      <Button variant="light" size="xs" onClick={onChangePassword}>
                        Byt lösenord
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="light"
                        color="red"
                        size="xs"
                        onClick={() => onDelete(user)}
                        loading={deleteLoading}
                      >
                        Ta bort
                      </Button>
                    )}
                  </Group>
                </>
              )}
            </Card>
          );
        })}
      </Stack>
    );
  }

  // --- Desktopvy: samma tabell som innan ---
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>E-post</Table.Th>
          <Table.Th>Roll</Table.Th>
          <Table.Th>Bandmedlem</Table.Th>
          <Table.Th>Ändra roll</Table.Th>
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {users.map((user) => {
          const isSelf = user.id === currentUserId;
          const roleOptions = getRoleOptions(currentUserRoles ?? [], user.roles, isSelf);
          const canChangeRole = roleOptions.length > 0;
          const canDelete = !isSelf && isAdmin;

          return (
            <Table.Tr key={user.id}>
              <Table.Td>
                <Group gap="sm">
                  <Text size="sm">{user.email}</Text>
                  {isSelf && <Badge variant="light" size="xs">Du</Badge>}
                </Group>
              </Table.Td>
              <Table.Td>
                <Badge color={getRoleBadgeColor(user.roles)} variant="light">
                  {getRoleLabel(user.roles)}
                </Badge>
              </Table.Td>
              <Table.Td>
                {user.memberName ? (
                  <Group gap="xs">
                    <Text size="sm">{user.memberName}</Text>
                    {isAdmin && (
                      <Button variant="subtle" color="red" size="xs" onClick={() => onUnlinkMember(user)}>
                        Bryt
                      </Button>
                    )}
                  </Group>
                ) : (
                  isAdmin && (
                    <Button variant="subtle" size="xs" onClick={() => onLinkMember(user)}>
                      Koppla till medlem
                    </Button>
                  )
                )}
              </Table.Td>
              <Table.Td>
                {canChangeRole ? (
                  <Select
                    size="xs"
                    data={roleOptions}
                    value={String(user.roles)}
                    onChange={(val) => {
                      if (val) onUpdateRole(user, { roles: Number(val) });
                    }}
                    disabled={roleLoading}
                    w={120}
                  />
                ) : (
                  <Text size="xs" c="dimmed">–</Text>
                )}
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {isSelf && (
                    <Button variant="light" size="xs" onClick={onChangePassword}>
                      Byt lösenord
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      variant="light"
                      color="red"
                      size="xs"
                      onClick={() => onDelete(user)}
                      loading={deleteLoading}
                    >
                      Ta bort
                    </Button>
                  )}
                </Group>
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
}