import { useState, useEffect } from 'react';
import {
  TextInput,
  NumberInput,
  Button,
  Stack,
  Group,
  Select,
} from '@mantine/core';
import { useAlbums } from '../../albums/hooks/useAlbums';
import type { SongResponse } from '../../../types/song.types';

interface SongFormProps {
  initialData?: SongResponse;
  onSubmit: (data: {
    albumId?: number;
    title: string;
    durationSeconds?: number;
    spotifyUrl?: string;
    writer?: string;
    trackNumber?: number;
  }) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function SongForm({ initialData, onSubmit, loading, errors }: SongFormProps) {
  const { data: albums } = useAlbums();

  const [albumId, setAlbumId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [durationSeconds, setDurationSeconds] = useState<number | string>('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [writer, setWriter] = useState('');
  const [trackNumber, setTrackNumber] = useState<number | string>('');

  useEffect(() => {
    if (initialData) {
      setAlbumId(initialData.albumId?.toString() ?? null);
      setTitle(initialData.title);
      setDurationSeconds(initialData.durationSeconds ?? '');
      setSpotifyUrl(initialData.spotifyUrl ?? '');
      setWriter(initialData.writer ?? '');
      setTrackNumber(initialData.trackNumber ?? '');
    }
  }, [initialData]);

  // Bygg album-options för Select-komponenten
  const albumOptions = (albums ?? []).map((a) => ({
    value: a.id.toString(),
    label: a.title,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      albumId: albumId ? Number(albumId) : undefined,
      title,
      durationSeconds: durationSeconds !== '' ? Number(durationSeconds) : undefined,
      spotifyUrl: spotifyUrl || undefined,
      writer: writer || undefined,
      trackNumber: trackNumber !== '' ? Number(trackNumber) : undefined,
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

        <Select
          label="Album"
          placeholder="Välj album (lämna tomt för singel)"
          data={albumOptions}
          value={albumId}
          onChange={(value) => setAlbumId(value as string | null)}
          error={errors?.albumId}
          clearable
          searchable
        />

        <Group grow>
          <NumberInput
            label="Spårnummer"
            placeholder="1"
            value={trackNumber}
            onChange={(value) => setTrackNumber(Number(value))}
            error={errors?.trackNumber}
            min={1}
          />

          <NumberInput
            label="Längd (sekunder)"
            placeholder="222"
            value={durationSeconds}
            onChange={(value) => setDurationSeconds(Number(value))}
            error={errors?.durationSeconds}
            min={0}
          />
        </Group>

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