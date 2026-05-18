import { useState, useEffect } from 'react';
import {
  TextInput,
  NumberInput,
  Button,
  Stack,
  Group,
} from '@mantine/core';
import type { SongResponse } from '../../../types/song.types';

interface SongFormProps {
  initialData?: SongResponse;
  onSubmit: (data: {
    title: string;
    durationSeconds?: number;
    spotifyUrl?: string;
    writer?: string;
  }) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function SongForm({ initialData, onSubmit, loading, errors }: SongFormProps) {
  const [title, setTitle] = useState('');
  const [durationSeconds, setDurationSeconds] = useState<number | string>('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [writer, setWriter] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDurationSeconds(initialData.durationSeconds ?? '');
      setSpotifyUrl(initialData.spotifyUrl ?? '');
      setWriter(initialData.writer ?? '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      title,
      durationSeconds: durationSeconds !== '' ? Number(durationSeconds) : undefined,
      spotifyUrl: spotifyUrl || undefined,
      writer: writer || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Titel"
          placeholder="T.ex. Midnattssolen"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          error={errors?.title}
          required
        />

        <NumberInput
          label="Längd (sekunder)"
          placeholder="222"
          value={durationSeconds}
          onChange={(value) => setDurationSeconds(Number(value))}
          error={errors?.durationSeconds}
          min={0}
        />

        <TextInput
          label="Låtskrivare"
          placeholder="Namn"
          value={writer}
          onChange={(e) => setWriter(e.currentTarget.value)}
          error={errors?.writer}
        />

        <TextInput
          label="Spotify URL"
          placeholder="https://open.spotify.com/track/..."
          value={spotifyUrl}
          onChange={(e) => setSpotifyUrl(e.currentTarget.value)}
          error={errors?.spotifyUrl}
        />

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            {initialData ? 'Uppdatera' : 'Skapa låt'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}