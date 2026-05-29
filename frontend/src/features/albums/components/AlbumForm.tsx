import { useState, useEffect } from 'react';
import {
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Image,
  ActionIcon,
  Text,
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconUpload, IconX, IconPhoto } from '@tabler/icons-react';
import { DateInput } from '@mantine/dates';
import { productsApi } from '../../../api/products.api';
import { getImageUrl } from '../../../utils/imageUrl';
import type { AlbumResponse } from '../../../types/album.types';

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
  const [title, setTitle] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [releaseDate, setReleaseDate] = useState<Date | null>(null);
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCoverImageUrl(initialData.coverImageUrl ?? '');
      setReleaseDate(initialData.releaseDate ? new Date(initialData.releaseDate) : null);
      setSpotifyUrl(initialData.spotifyUrl ?? '');
      setDescription(initialData.description ?? '');
    }
  }, [initialData]);

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;
    setUploading(true);
    try {
      const res = await productsApi.uploadImage(files[0], 'albums');
      setCoverImageUrl(res.url ?? '');
    } catch {
      // handled by notifications
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      coverImageUrl: coverImageUrl || undefined,
      releaseDate: releaseDate ? releaseDate.toISOString() : undefined,
      spotifyUrl: spotifyUrl || undefined,
      description: description || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Titel"
          placeholder="T.ex. Debut"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          error={errors?.title}
          required
        />

        <DateInput
          valueFormat="YYYY-MM-DD"
          label="Releasedatum"
          placeholder="Välj datum"
          value={releaseDate}
          onChange={(value) => setReleaseDate(value ? new Date(value) : null)}
          error={errors?.releaseDate}
          clearable
        />

        <TextInput
          label="Spotify URL"
          placeholder="https://open.spotify.com/album/..."
          value={spotifyUrl}
          onChange={(e) => setSpotifyUrl(e.currentTarget.value)}
          error={errors?.spotifyUrl}
        />

        <Textarea
          label="Beskrivning"
          placeholder="Kort beskrivning av albumet"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          error={errors?.description}
          minRows={3}
        />

        {/* Omslagsbild */}
        <div>
          <Text size="sm" fw={500} mb={4}>Omslagsbild</Text>
          {coverImageUrl ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Image
                src={getImageUrl(coverImageUrl)}
                alt="Omslagsbild"
                radius="md"
                maw={200}
              />
              <ActionIcon
                color="red"
                variant="filled"
                size="sm"
                radius="xl"
                style={{ position: 'absolute', top: 4, right: 4 }}
                onClick={() => setCoverImageUrl('')}
              >
                <IconX size={14} />
              </ActionIcon>
            </div>
          ) : (
            <Dropzone
              onDrop={handleUpload}
              accept={IMAGE_MIME_TYPE}
              maxSize={10 * 1024 * 1024}
              multiple={false}
              loading={uploading}
            >
              <Group justify="center" gap="sm" style={{ pointerEvents: 'none', padding: 20 }}>
                <Dropzone.Accept>
                  <IconUpload size={32} stroke={1.5} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size={32} stroke={1.5} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto size={32} stroke={1.5} />
                </Dropzone.Idle>
                <Text size="sm" c="dimmed">
                  Dra hit en bild eller klicka för att välja
                </Text>
              </Group>
            </Dropzone>
          )}
        </div>

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            {initialData ? 'Uppdatera' : 'Skapa album'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}