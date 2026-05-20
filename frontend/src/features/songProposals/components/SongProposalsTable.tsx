import { Table, Badge, Group, ActionIcon, Text } from '@mantine/core';
import { IconEdit, IconTrash, IconTrophy } from '@tabler/icons-react';
import type { SongProposalResponse } from '../../../types/songProposal.types';

interface SongProposalsTableProps {
  proposals: SongProposalResponse[];
  onEdit: (proposal: SongProposalResponse) => void;
  onDelete: (proposal: SongProposalResponse) => void;
  onSetWinner: (proposal: SongProposalResponse) => void;
  deleteLoading?: boolean;
  winnerLoading?: boolean;
}

export function SongProposalsTable({
  proposals,
  onEdit,
  onDelete,
  onSetWinner,
  deleteLoading,
  winnerLoading,
}: SongProposalsTableProps) {
  if (proposals.length === 0) {
    return <Text c="dimmed">Inga låtförslag ännu.</Text>;
  }

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Titel</Table.Th>
          <Table.Th>Röster</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Skapad av</Table.Th>
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {proposals.map((p) => (
          <Table.Tr key={p.id}>
            <Table.Td>{p.title}</Table.Td>
            <Table.Td>{p.voteCount}</Table.Td>
            <Table.Td>
              <Group gap="xs">
                {p.isWinner && <Badge color="yellow">Vinnare</Badge>}
                {p.isActive ? (
                  <Badge color="green">Aktiv</Badge>
                ) : (
                  <Badge color="gray">Inaktiv</Badge>
                )}
              </Group>
            </Table.Td>
            <Table.Td>{p.createdByEmail ?? '–'}</Table.Td>
            <Table.Td>
              <Group gap="xs" justify="flex-end">
                {p.isActive && !p.isWinner && (
                  <ActionIcon
                    variant="subtle"
                    color="yellow"
                    onClick={() => onSetWinner(p)}
                    loading={winnerLoading}
                    title="Utse till vinnare"
                  >
                    <IconTrophy size={16} />
                  </ActionIcon>
                )}
                <ActionIcon variant="subtle" color="blue" onClick={() => onEdit(p)} title="Redigera">
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => onDelete(p)}
                  loading={deleteLoading}
                  title="Ta bort"
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}