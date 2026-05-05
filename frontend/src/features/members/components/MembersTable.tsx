import { Table, Group, Button, Text, Avatar } from '@mantine/core';
import type { MemberResponse } from '../../../types/member.types';

interface MembersTableProps {
  members: MemberResponse[];
  onEdit: (member: MemberResponse) => void;
  onDelete: (member: MemberResponse) => void;
  deleteLoading?: boolean;
}

export function MembersTable({ members, onEdit, onDelete, deleteLoading }: MembersTableProps) {
  if (members.length === 0) {
    return <Text c="dimmed">Inga medlemmar än. Lägg till den första!</Text>;
  }

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Ordning</Table.Th>
          <Table.Th>Medlem</Table.Th>
          <Table.Th>Citat</Table.Th>
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {members.map((member) => (
          <Table.Tr key={member.id}>
            <Table.Td>{member.displayOrder}</Table.Td>
            <Table.Td>
              <Group gap="sm">
                <Avatar src={member.imageUrl} size={32} radius="xl" color="blue">
                  {member.name.charAt(0)}
                </Avatar>
                <Text fw={500}>{member.name}</Text>
              </Group>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed" lineClamp={1}>
                {member.quote ?? '–'}
              </Text>
            </Table.Td>
            <Table.Td>
              <Group gap="xs">
                <Button variant="light" size="xs" onClick={() => onEdit(member)}>
                  Redigera
                </Button>
                <Button variant="light" color="red" size="xs" onClick={() => onDelete(member)} loading={deleteLoading}>
                  Ta bort
                </Button>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}