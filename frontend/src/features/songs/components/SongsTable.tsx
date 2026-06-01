import { Table, Group, Button, Text, Badge, Card, Stack, SimpleGrid, Avatar } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import type { SongResponse } from '../../../types/song.types';
import type { AlbumResponse } from '../../../types/album.types';
import { getImageUrl } from '../../../utils/imageUrl';

const SONG_PLACEHOLDER = '/images/song-default.png';

function formatDuration(seconds?: number): string {
  if (!seconds) return '-';
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function formatRelease(releaseDate?: string): string {
  if (!releaseDate) return '–';
  return new Date(releaseDate).toLocaleDateString('sv-SE');
}

function sortByRelease(songs: SongResponse[]): SongResponse[] {
  return [...songs].sort((a, b) => {
    if (!a.releaseDate && !b.releaseDate) return 0;
    if (!a.releaseDate) return 1;
    if (!b.releaseDate) return -1;
    return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
  });
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
  const isMobile = useMediaQuery('(max-width: 768px)');

  const getAlbumTitle = (albumId?: number) => {
    if (!albumId) return null;
    return albums.find((a) => a.id === albumId)?.title ?? null;
  };

  if (songs.length === 0) {
    return <Text c="dimmed">Inga låtar än. Skapa den första!</Text>;
  }

  const sorted = sortByRelease(songs);

  if (isMobile) {
    return (
      <Stack gap="sm">
        {sorted.map((song) => (
          <Card key={song.id} shadow="xs" padding="sm" radius="md" withBorder>
            <Group justify="space-between" mb={4}>
              <Group gap="xs">
                <Avatar
                  src={getImageUrl(song.imageUrl ?? SONG_PLACEHOLDER)}
                  size="sm"
                  radius="sm"
                />
                <Text size="sm" fw={600}>{song.title}</Text>
              </Group>
              {getAlbumTitle(song.albumId) ? (
                <Badge variant="light" size="sm">{getAlbumTitle(song.albumId)}</Badge>
              ) : (
                <Badge variant="light" color="gray" size="sm">Singel</Badge>
              )}
            </Group>

            <SimpleGrid cols={2} spacing="xs" mb="xs">
              {song.musicWriter && (
                <Text size="xs" c="dimmed">Musik: {song.musicWriter}</Text>
              )}
              {song.lyricsWriter && (
                <Text size="xs" c="dimmed">Text: {song.lyricsWriter}</Text>
              )}
              {song.durationSeconds && (
                <Text size="xs" c="dimmed">Längd: {formatDuration(song.durationSeconds)}</Text>
              )}
              <Text size="xs" c="dimmed">Release: {formatRelease(song.releaseDate)}</Text>
            </SimpleGrid>

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
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Bild</Table.Th>
          <Table.Th>Titel</Table.Th>
          <Table.Th miw={120}>Album</Table.Th>
          <Table.Th>Musik av</Table.Th>
          <Table.Th>Text av</Table.Th>
          <Table.Th>Längd</Table.Th>
          <Table.Th>Release</Table.Th>
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {sorted.map((song) => (
          <Table.Tr key={song.id}>
            <Table.Td>
              <Avatar
                src={getImageUrl(song.imageUrl ?? SONG_PLACEHOLDER)}
                size="md"
                radius="sm"
              />
            </Table.Td>
            <Table.Td>
              <Text size="sm" fw={500}>{song.title}</Text>
            </Table.Td>
            <Table.Td miw={120}>
              {getAlbumTitle(song.albumId) ?? (
                <Badge variant="light" color="gray" size="sm">Singel</Badge>
              )}
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed">{song.musicWriter ?? '–'}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed">{song.lyricsWriter ?? '–'}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed">{formatDuration(song.durationSeconds)}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed">{formatRelease(song.releaseDate)}</Text>
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