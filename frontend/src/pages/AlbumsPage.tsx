import { Container, Title, Text, Card, Group, Stack, Loader, Alert } from '@mantine/core';
import { useAlbums } from '../features/albums/hooks/useAlbums';

export function AlbumsPage() {
  const { data: albums, isLoading, error } = useAlbums();

  if (isLoading) {
    return (
      <Container py="xl">
        <Group justify="center">
          <Loader size="lg" />
        </Group>
      </Container>
    );
  }

  if (error) {
    return (
      <Container py="xl">
        <Alert color="red" title="Något gick fel">
          Kunde inte hämta album. Är backend igång?
        </Alert>
      </Container>
    );
  }

  if (!albums || albums.length === 0) {
    return (
      <Container py="xl">
        <Title order={1} mb="lg">Album</Title>
        <Text c="dimmed">Inga album än. Skapa det första!</Text>
      </Container>
    );
  }

  return (
    <Container py="xl">
      <Title order={1} mb="lg">Album</Title>
      <Stack gap="md">
        {albums.map((album) => (
          <Card key={album.id} shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3}>{album.title}</Title>
            {album.description && (
              <Text c="dimmed" mt="sm">{album.description}</Text>
            )}
            {album.releaseDate && (
              <Text size="sm" c="dimmed" mt="xs">
                Släppt: {new Date(album.releaseDate).toLocaleDateString('sv-SE')}
              </Text>
            )}
          </Card>
        ))}
      </Stack>
    </Container>
  );
}