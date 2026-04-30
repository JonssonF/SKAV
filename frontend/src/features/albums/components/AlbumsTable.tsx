import { Table, Group, Button, Text } from '@mantine/core';
import type { AlbumResponse } from '../../../types/album.types';

interface AlbumsTableProps {
  albums: AlbumResponse[];
  onEdit: (album: AlbumResponse) => void;
  onDelete: (album: AlbumResponse) => void;
  deleteLoading?: boolean;
}

export function AlbumsTable({ albums, onEdit, onDelete, deleteLoading }: AlbumsTableProps) {
  if (albums.length === 0) {
    return <Text c="dimmed">Inga album än. Skapa det första!</Text>;
  }

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Titel</Table.Th>
          <Table.Th>Releasedatum</Table.Th>
          <Table.Th>Beskrivning</Table.Th>
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {albums.map((album) => (
          <Table.Tr key={album.id}>
            <Table.Td>{album.title}</Table.Td>
            <Table.Td>
              {album.releaseDate
                ? new Date(album.releaseDate).toLocaleDateString('sv-SE')
                : '-'}
            </Table.Td>
            <Table.Td>{album.description ?? '-'}</Table.Td>
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