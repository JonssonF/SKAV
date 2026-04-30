import { Table, Group, Button, Text, Badge } from '@mantine/core';
import type { SongResponse } from '../../../types/song.types';
import type { AlbumResponse } from '../../../types/album.types';

function formatDuration(seconds?: number): string {
  if (!seconds) return '-';
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

interface SongsTableProps {
  songs: SongResponse[];
  albums: AlbumResponse[];
  onEdit: (song: SongResponse) => void;
  onDelete: (song: SongResponse) => void;
  onLyrics: (song: SongResponse) => void;
  deleteLoading?: boolean;
}

export function SongsTable({ songs, albums, onEdit, onDelete, onLyrics, deleteLoading }: SongsTableProps) {
  const getAlbumTitle = (albumId?: number) => {
    if (!albumId) return null;
    return albums.find((a) => a.id === albumId)?.title ?? null;
  };

  if (songs.length === 0) {
    return <Text c="dimmed">Inga låtar än. Skapa den första!</Text>;
  }

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Titel</Table.Th>
          <Table.Th>Album</Table.Th>
          <Table.Th>Spår</Table.Th>
          <Table.Th>Längd</Table.Th>
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {songs.map((song) => (
          <Table.Tr key={song.id}>
            <Table.Td>{song.title}</Table.Td>
            <Table.Td>
              {getAlbumTitle(song.albumId) ?? (
                <Badge variant="light" color="gray" size="sm">Singel</Badge>
              )}
            </Table.Td>
            <Table.Td>{song.trackNumber ?? '-'}</Table.Td>
            <Table.Td>{formatDuration(song.durationSeconds)}</Table.Td>
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