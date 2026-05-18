import { Table, Group, Button, Text } from '@mantine/core';
import type { SongResponse } from '../../../types/song.types';

function formatDuration(seconds?: number): string {
  if (!seconds) return '-';
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

interface SongsTableProps {
  songs: SongResponse[];
  onEdit: (song: SongResponse) => void;
  onDelete: (song: SongResponse) => void;
  onLyrics: (song: SongResponse) => void;
  deleteLoading?: boolean;
}

export function SongsTable({ songs, onEdit, onDelete, onLyrics, deleteLoading }: SongsTableProps) {
  if (songs.length === 0) {
    return <Text c="dimmed">Inga låtar än. Skapa den första!</Text>;
  }

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Titel</Table.Th>
          <Table.Th>Låtskrivare</Table.Th>
          <Table.Th>Längd</Table.Th>
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {songs.map((song) => (
          <Table.Tr key={song.id}>
            <Table.Td>
              <Text size="sm" fw={500}>{song.title}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed">{song.writer ?? '–'}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed">{formatDuration(song.durationSeconds)}</Text>
            </Table.Td>
            <Table.Td>
              <Group gap="xs">
                <Button variant="light" color="violet" size="xs" onClick={() => onLyrics(song)}>
                  Låttext
                </Button>
                <Button variant="light" size="xs" onClick={() => onEdit(song)}>
                  Redigera
                </Button>
                <Button variant="light" color="red" size="xs" onClick={() => onDelete(song)} loading={deleteLoading}>
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