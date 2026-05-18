import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Loader,
  Alert,
  Badge,
  Collapse,
} from '@mantine/core';
import { useSongs } from '../../songs/hooks/useSongs';
import { useLyrics } from '../../lyrics/hooks/useLyrics';
import type { SongResponse } from '../../../types/song.types';
import type { LyricsResponse } from '../../../types/lyrics.types';

function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function SongRow({ song, index, lyrics }: { song: SongResponse; index: number; lyrics?: LyricsResponse }) {
  const [open, setOpen] = useState(false);
  const hasLyrics = !!lyrics;

  return (
    <div>
      <Group
        justify="space-between"
        py="xs"
        style={{
          borderBottom: '1px solid var(--mantine-color-default-border)',
          cursor: hasLyrics ? 'pointer' : 'default',
        }}
        onClick={() => hasLyrics && setOpen(!open)}
      >
        <Group gap="md">
          <Text size="sm" c="dimmed" w={24} ta="right">
            {index + 1}
          </Text>
          <div>
            <Group gap="xs">
              <Text size="sm">{song.title}</Text>
              {hasLyrics && (
                <Badge variant="light" color="violet" size="xs">
                  Låttext
                </Badge>
              )}
            </Group>
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

      {hasLyrics && (
        <Collapse expanded={open}>
          <div style={{ padding: '12px 0 12px 36px' }}>
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
        <Title order={2} mb="lg" ta="center">Musik</Title>
        <Text c="dimmed" ta="center">Inga låtar tillagda än.</Text>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg" ta="center">Musik</Title>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {songs.map((song, i) => (
          <SongRow
            key={song.id}
            song={song}
            index={i}
            lyrics={(allLyrics ?? []).find((l) => l.songId === song.id)}
          />
        ))}
      </Card>
    </Container>
  );
}