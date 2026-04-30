import { Table, Group, Button, Text } from '@mantine/core';
import type { GigResponse } from '../../../types/gig.types';

interface GigsTableProps {
  gigs: GigResponse[];
  onEdit: (gig: GigResponse) => void;
  onDelete: (gig: GigResponse) => void;
  deleteLoading?: boolean;
}

export function GigsTable({ gigs, onEdit, onDelete, deleteLoading }: GigsTableProps) {
  if (gigs.length === 0) {
    return <Text c="dimmed">Inga spelningar än. Skapa den första!</Text>;
  }

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Titel</Table.Th>
          <Table.Th>Plats</Table.Th>
          <Table.Th>Datum</Table.Th>
          <Table.Th>Pris</Table.Th>
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {gigs.map((gig) => (
          <Table.Tr key={gig.id}>
            <Table.Td>{gig.title}</Table.Td>
            <Table.Td>{gig.location}</Table.Td>
            <Table.Td>{new Date(gig.date).toLocaleDateString('sv-SE')}</Table.Td>
            <Table.Td>{gig.price != null ? `${gig.price} kr` : 'Gratis'}</Table.Td>
            <Table.Td>
              <Group gap="xs">
                <Button variant="light" size="xs" onClick={() => onEdit(gig)}>
                  Redigera
                </Button>
                <Button variant="light" color="red" size="xs" onClick={() => onDelete(gig)} loading={deleteLoading}>
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