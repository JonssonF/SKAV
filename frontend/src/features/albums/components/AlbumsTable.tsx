import { Table, Group, Button, Text, Image, Card, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { getImageUrl } from '../../../utils/imageUrl';
import type { AlbumResponse } from '../../../types/album.types';

function formatRelease(releaseDate?: string): string {
  if (!releaseDate) return '–';
  return new Date(releaseDate).toLocaleDateString('sv-SE');
}

interface AlbumsTableProps {
  albums: AlbumResponse[];
  onEdit: (album: AlbumResponse) => void;
  onDelete: (album: AlbumResponse) => void;
  deleteLoading?: boolean;
}

export function AlbumsTable({ albums, onEdit, onDelete, deleteLoading }: AlbumsTableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (albums.length === 0) {
    return <Text c="dimmed">Inga album än. Skapa det första!</Text>;
  }

  const sorted = [...albums].sort((a, b) => {
    if (!a.releaseDate && !b.releaseDate) return 0;
    if (!a.releaseDate) return 1;
    if (!b.releaseDate) return -1;
    return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
  });

  if (isMobile) {
    return (
      <Stack gap="sm">
        {sorted.map((album) => (
          <Card key={album.id} shadow="xs" padding="sm" radius="md" withBorder>
            <Group gap="sm" mb="xs">
              {album.coverImageUrl && (
                <Image
                  src={getImageUrl(album.coverImageUrl)}
                  alt={album.title}
                  w={48}
                  h={48}
                  radius="sm"
                  fit="cover"
                />
              )}
              <div>
                <Text size="sm" fw={600}>{album.title}</Text>
                <Text size="xs" c="dimmed">Release: {formatRelease(album.releaseDate)}</Text>
              </div>
            </Group>
            {album.description && (
              <Text size="xs" c="dimmed" mb="xs" lineClamp={2}>{album.description}</Text>
            )}
            <Group gap="xs">
              <Button variant="light" size="xs" onClick={() => onEdit(album)}>
                Redigera
              </Button>
              <Button variant="light" color="red" size="xs" onClick={() => onDelete(album)} loading={deleteLoading}>
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
          <Table.Th>Omslag</Table.Th>
          <Table.Th>Titel</Table.Th>
          <Table.Th>Release</Table.Th>
          <Table.Th>Beskrivning</Table.Th>
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {sorted.map((album) => (
          <Table.Tr key={album.id}>
            <Table.Td>
              {album.coverImageUrl ? (
                <Image
                  src={getImageUrl(album.coverImageUrl)}
                  alt={album.title}
                  w={48}
                  h={48}
                  radius="sm"
                  fit="cover"
                />
              ) : (
                <Text size="xs" c="dimmed">–</Text>
              )}
            </Table.Td>
            <Table.Td>
              <Text size="sm" fw={500}>{album.title}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed">{formatRelease(album.releaseDate)}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed" lineClamp={1}>{album.description ?? '–'}</Text>
            </Table.Td>
            <Table.Td>
              <Group gap="xs">
                <Button variant="light" size="xs" onClick={() => onEdit(album)}>
                  Redigera
                </Button>
                <Button variant="light" color="red" size="xs" onClick={() => onDelete(album)} loading={deleteLoading}>
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