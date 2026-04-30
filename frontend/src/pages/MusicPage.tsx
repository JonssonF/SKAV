import {
  Container,
  Title,
  Text,
  Card,
  Group,
//   Stack,
  Loader,
  Alert,
  Accordion,
  Badge,
} from '@mantine/core';
import { useAlbums } from '../features/albums/hooks/useAlbums';
import { useSongs } from '../features/songs/hooks/useSongs';
import type { AlbumResponse } from '../types/album.types';
import type { SongResponse } from '../types/song.types';
import { useState } from 'react';
import { Collapse } from '@mantine/core';
import { lyricsApi } from '../api/lyrics.api';
import type { LyricsResponse } from '../types/lyrics.types';

// Hjälpfunktion — formaterar sekunder till "3:42"
function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function SongRow({ song, index }: { song: SongResponse; index: number }) {
  const [open, setOpen] = useState(false);
  const [lyrics, setLyrics] = useState<LyricsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleClick = async () => {
    // Om redan öppen, stäng
    if (open) {
      setOpen(false);
      return;
    }

    // Hämta lyrics första gången man klickar
    if (!checked) {
      setLoading(true);
      try {
        const slug = song.title
          .toLowerCase()
          .replace(/[åä]/g, 'a')
          .replace(/[ö]/g, 'o')
          .replace(/[é]/g, 'e')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');

        const data = await lyricsApi.getBySlug(slug);
        setLyrics(data);
      } catch {
        // Ingen låttext finns — det är ok
        setLyrics(null);
      } finally {
        setLoading(false);
        setChecked(true);
      }
    }

    setOpen(true);
  };

  return (
    <div>
      <Group
        justify="space-between"
        py="xs"
        style={{
          borderBottom: '1px solid var(--mantine-color-default-border)',
          cursor: 'pointer',
        }}
        onClick={handleClick}
      >
        <Group gap="md">
          <Text size="sm" c="dimmed" w={24} ta="right">
            {song.trackNumber ?? index + 1}
          </Text>
          <div>
            <Text size="sm">{song.title}</Text>
            {song.writer && (
              <Text size="xs" c="dimmed">{song.writer}</Text>
            )}
          </div>
        </Group>
        <Group gap="md">
          {song.spotifyUrl && (
            <Text
              size="xs"
              component="a"
              href={song.spotifyUrl}
              target="_blank"
              c="blue"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              Spotify
            </Text>
          )}
          <Text size="sm" c="dimmed">{formatDuration(song.durationSeconds)}</Text>
        </Group>
      </Group>

      <Collapse expanded={open}>
        <div style={{ padding: '12px 0 12px 36px' }}>
          {loading ? (
            <Loader size="sm" />
          ) : lyrics ? (
            <Text
              size="sm"
              style={{ whiteSpace: 'pre-line' }}
            >
              {lyrics.body}
            </Text>
          ) : (
            <Text size="sm" c="dimmed" fs="italic">
              Ingen låttext tillagd.
            </Text>
          )}
        </div>
      </Collapse>
    </div>
  );
}

function AlbumCard({ album, songs }: { album: AlbumResponse; songs: SongResponse[] }) {
  const albumSongs = songs
    .filter((s) => s.albumId === album.id)
    .sort((a, b) => (a.trackNumber ?? 0) - (b.trackNumber ?? 0));

  return (
    <Accordion.Item value={`album-${album.id}`}>
      <Accordion.Control>
        <Group justify="space-between" pr="md">
          <div>
            <Text fw={500}>{album.title}</Text>
            {album.releaseDate && (
              <Text size="xs" c="dimmed">
                {new Date(album.releaseDate).toLocaleDateString('sv-SE', {
                  year: 'numeric',
                  month: 'long',
                })}
              </Text>
            )}
          </div>
          <Badge variant="light" color="gray" size="sm">
            {albumSongs.length} låtar
          </Badge>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        {album.description && (
          <Text size="sm" c="dimmed" mb="md">{album.description}</Text>
        )}
        {album.spotifyUrl && (
          <Text
            size="sm"
            component="a"
            href={album.spotifyUrl}
            target="_blank"
            c="blue"
            mb="md"
            display="inline-block"
          >
            Lyssna på Spotify →
          </Text>
        )}
        {albumSongs.length === 0 ? (
          <Text size="sm" c="dimmed">Inga låtar tillagda än.</Text>
        ) : (
          albumSongs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} />
          ))
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export function MusicPage() {
  const { data: albums, isLoading: albumsLoading, error: albumsError } = useAlbums();
  const { data: songs, isLoading: songsLoading, error: songsError } = useSongs();

  const isLoading = albumsLoading || songsLoading;
  const error = albumsError || songsError;

  if (isLoading) {
    return (
      <Container py="xl">
        <Group justify="center"><Loader size="lg" /></Group>
      </Container>
    );
  }

  if (error) {
    return (
      <Container py="xl">
        <Alert color="red" title="Något gick fel">
          Kunde inte hämta musik.
        </Alert>
      </Container>
    );
  }

  // Dela upp låtar: de med album vs singlar
  const singles = (songs ?? []).filter((s) => !s.albumId);
  const albumList = (albums ?? []).sort((a, b) => {
    if (!a.releaseDate) return 1;
    if (!b.releaseDate) return -1;
    return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
  });

  return (
    <Container py="xl">
      <Title order={1} mb="lg">Musik</Title>

      {albumList.length === 0 && singles.length === 0 && (
        <Text c="dimmed">Ingen musik tillagd än.</Text>
      )}

      {albumList.length > 0 && (
        <>
          <Title order={2} size="h3" mb="md">Album</Title>
          <Accordion variant="separated" mb="xl">
            {albumList.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                songs={songs ?? []}
              />
            ))}
          </Accordion>
        </>
      )}

      {singles.length > 0 && (
        <>
          <Title order={2} size="h3" mb="md">Singlar</Title>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            {singles.map((song, i) => (
              <SongRow key={song.id} song={song} index={i} />
            ))}
          </Card>
        </>
      )}
    </Container>
  );
}