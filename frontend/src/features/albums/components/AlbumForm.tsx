import { useState, useEffect } from 'react';
import {
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import type { AlbumResponse } from '../../../types/album.types';

// Props — samma mönster som GigForm
// initialData = redigering, utan = skapa nytt
// errors kommer från backend-validering via getApiErrors()
interface AlbumFormProps {
  initialData?: AlbumResponse;
  onSubmit: (data: {
    title: string;
    coverImageUrl?: string;
    releaseDate?: string;
    spotifyUrl?: string;
    description?: string;
  }) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function AlbumForm({ initialData, onSubmit, loading, errors }: AlbumFormProps) {
  // Ett state per fält — samma mönster som GigForm
  const [title, setTitle] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [releaseDate, setReleaseDate] = useState<string | null>(null);
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [description, setDescription] = useState('');

  // Fyll i fälten om vi redigerar ett befintligt album
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCoverImageUrl(initialData.coverImageUrl ?? '');
      setReleaseDate(initialData.releaseDate ?? null);
      setSpotifyUrl(initialData.spotifyUrl ?? '');
      setDescription(initialData.description ?? '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Skicka data till parent-komponenten (AdminAlbumsPage)
    // Tomma strängar blir undefined — backend förväntar sig null/undefined, inte ""
    onSubmit({
      title,
      coverImageUrl: coverImageUrl || undefined,
      releaseDate: releaseDate ? new Date(releaseDate).toISOString() : undefined,
      spotifyUrl: spotifyUrl || undefined,
      description: description || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {/* Enda required-fältet — Title */}
        <TextInput
          label="Titel"
          placeholder="T.ex. Debut EP"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          error={errors?.title}
          required
        />

        {/* Textarea istället för TextInput — ger flerradigt fält */}
        <Textarea
          label="Beskrivning"
          placeholder="Beskriv albumet..."
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          error={errors?.description}
          minRows={3}
        />

        {/* DatePickerInput istället för DateTimePicker — album behöver bara datum, inte tid */}
        <DatePickerInput
          label="Releasedatum"
          placeholder="Välj datum"
          value={releaseDate}
          onChange={setReleaseDate}
          error={errors?.releaseDate}
        />

        <TextInput
          label="Omslagsbild URL"
          placeholder="https://..."
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.currentTarget.value)}
          error={errors?.coverImageUrl}
        />

        <TextInput
          label="Spotify URL"
          placeholder="https://open.spotify.com/album/..."
          value={spotifyUrl}
          onChange={(e) => setSpotifyUrl(e.currentTarget.value)}
          error={errors?.spotifyUrl}
        />

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            {initialData ? 'Uppdatera' : 'Skapa album'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}