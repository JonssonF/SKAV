import { useState } from 'react';
import {
  Container,
  Text,
  Card,
  Group,
  Loader,
  Alert,
  Badge,
  Collapse,
  Image,
} from '@mantine/core';
import { useSongs } from '../../songs/hooks/useSongs';
import { useLyrics } from '../../lyrics/hooks/useLyrics';
import type { SongResponse } from '../../../types/song.types';
import type { LyricsResponse } from '../../../types/lyrics.types';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import { SpotifyPlayer } from './SpotifyPlayer';
import { getImageUrl } from '../../../utils/imageUrl';

const SONG_PLACEHOLDER = '/images/song-default.png';

function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function SongRow({ song, lyrics }: { song: SongResponse; lyrics?: LyricsResponse }) {
  const [open, setOpen] = useState(false);
  const hasLyrics = !!lyrics;

  const songImage = song.imageUrl
    ? getImageUrl(song.imageUrl)
    : getImageUrl(SONG_PLACEHOLDER);

  return (
    <div>
      <Group
        justify="space-between"
        py="sm"
        px="xs"
        wrap="nowrap"
        style={{
          borderBottom: '1px solid var(--mantine-color-default-border)',
          cursor: hasLyrics ? 'pointer' : 'default',
        }}
        onClick={() => hasLyrics && setOpen(!open)}
      >
        <Group gap="md" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
          <Image
            src={songImage}
            alt={song.title}
            w={48}
            h={48}
            radius="sm"
            fit="cover"
            style={{ flexShrink: 0 }}
          />
          <div style={{ minWidth: 0 }}>
            <Group gap="xs" wrap="nowrap">
              <Text size="sm" fw={500} truncate>
                {song.title}
              </Text>
              {hasLyrics && (
                <Badge variant="light" color="violet" size="xs" style={{ flexShrink: 0 }}>
                  Låttext
                </Badge>
              )}
            </Group>
            {(song.musicWriter || song.lyricsWriter || song.releaseDate) && (
              <Text size="xs" c="dimmed" truncate>
                {song.releaseDate && new Date(song.releaseDate).getFullYear()}
                {song.releaseDate && (song.musicWriter || song.lyricsWriter) && ' · '}
                {song.musicWriter && `Musik: ${song.musicWriter}`}
                {song.musicWriter && song.lyricsWriter && ' · '}
                {song.lyricsWriter && `Text: ${song.lyricsWriter}`}
              </Text>
            )}
          </div>
        </Group>

        <Group gap="md" wrap="nowrap" style={{ flexShrink: 0 }}>
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
          {song.youtubeUrl && (
            <Text
              size="xs"
              component="a"
              href={song.youtubeUrl}
              target="_blank"
              c="red"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              YouTube
            </Text>
          )}
          <Text size="sm" c="dimmed" style={{ minWidth: 36, textAlign: 'right' }}>
            {formatDuration(song.durationSeconds)}
          </Text>
        </Group>
      </Group>

      {hasLyrics && (
        <Collapse expanded={open}>
          <div style={{ padding: '12px 0 12px 64px' }}>
            <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
              {lyrics.body}
            </Text>
          </div>
        </Collapse>
      )}
    </div>
  );
}

export function MusicSection() {
  const { data: songs, isLoading, error } = useSongs();
  const { data: allLyrics } = useLyrics();

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Group justify="center"><Loader size="lg" /></Group>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert color="red" title="Något gick fel">
          Kunde inte hämta musik.
        </Alert>
      </Container>
    );
  }

  if (!songs || songs.length === 0) {
    return (
      <Container size="lg" py="xl">
        <SectionTitle text="Musik" />
        <Text c="dimmed" ta="center">Inga låtar tillagda än.</Text>
      </Container>
    );
  }

  const sortedSongs = [...songs].sort((a, b) => {
    if (!a.releaseDate && !b.releaseDate) return 0;
    if (!a.releaseDate) return 1;
    if (!b.releaseDate) return -1;
    return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
  });

  return (
    <Container size="lg" py="xl">
      <SectionTitle text="Musik" />
      <SpotifyPlayer />
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {sortedSongs.map((song) => (
          <SongRow
            key={song.id}
            song={song}
            lyrics={(allLyrics ?? []).find((l) => l.songId === song.id)}
          />
        ))}
      </Card>
    </Container>
  );
}