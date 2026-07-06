import { useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { Table, Group, Button, Text, Card, Stack, Divider } from '@mantine/core';
import type { GigResponse } from '../../../types/gig.types';

interface GigsTableProps {
  gigs: GigResponse[];
  onEdit: (gig: GigResponse) => void;
  onDelete: (gig: GigResponse) => void;
  deleteLoading?: boolean;
}

const INITIAL_PAST_COUNT = 3;

export function GigsTable({ gigs, onEdit, onDelete, deleteLoading }: GigsTableProps) {
  const isMobile = useMediaQuery('(max-width: 48em)');
  const [showAllPast, setShowAllPast] = useState(false);

  if (gigs.length === 0) {
    return <Text c="dimmed">Inga spelningar än. Skapa den första!</Text>;
  }

  const now = new Date();
  const upcoming = gigs.filter((g) => new Date(g.date) >= now);
  const past = gigs
    .filter((g) => new Date(g.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const visiblePast = showAllPast ? past : past.slice(0, INITIAL_PAST_COUNT);
  const hiddenCount = past.length - INITIAL_PAST_COUNT;

  const renderRow = (gig: GigResponse) => (
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
  );

  const renderCard = (gig: GigResponse) => (
    <Card key={gig.id} withBorder padding="sm">
      <Text size="sm" fw={500} mb="xs">{gig.title}</Text>

      <Group justify="space-between" mb="xs">
        <Text size="xs" c="dimmed">Plats</Text>
        <Text size="sm">{gig.location}</Text>
      </Group>

      <Group justify="space-between" mb="xs">
        <Text size="xs" c="dimmed">Datum</Text>
        <Text size="sm">{new Date(gig.date).toLocaleDateString('sv-SE')}</Text>
      </Group>

      <Group justify="space-between" mb="xs">
        <Text size="xs" c="dimmed">Pris</Text>
        <Text size="sm">{gig.price != null ? `${gig.price} kr` : 'Gratis'}</Text>
      </Group>

      <Divider my="xs" />
      <Group gap="xs">
        <Button variant="light" size="xs" onClick={() => onEdit(gig)}>
          Redigera
        </Button>
        <Button variant="light" color="red" size="xs" onClick={() => onDelete(gig)} loading={deleteLoading}>
          Ta bort
        </Button>
      </Group>
    </Card>
  );

  // --- Mobilvy ---
  if (isMobile) {
    return (
      <Stack gap="md">
        {upcoming.length > 0 && (
          <Stack gap="sm">
            {upcoming.map(renderCard)}
          </Stack>
        )}

        {past.length > 0 && (
          <Stack gap="sm">
            <Divider label="Tidigare spelningar" labelPosition="center" />
            {visiblePast.map(renderCard)}
            {!showAllPast && hiddenCount > 0 && (
              <Button variant="subtle" size="xs" onClick={() => setShowAllPast(true)}>
                Visa {hiddenCount} äldre spelningar
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    );
  }

  // --- Desktopvy ---
  return (
    <Stack gap="md">
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
          {upcoming.map(renderRow)}
        </Table.Tbody>
      </Table>

      {past.length > 0 && (
        <>
          <Divider label="Tidigare spelningar" labelPosition="center" />
          <Table striped highlightOnHover>
            <Table.Tbody>
              {visiblePast.map(renderRow)}
            </Table.Tbody>
          </Table>
          {!showAllPast && hiddenCount > 0 && (
            <Button variant="subtle" size="xs" onClick={() => setShowAllPast(true)}>
              Visa {hiddenCount} äldre spelningar
            </Button>
          )}
        </>
      )}
    </Stack>
  );
}