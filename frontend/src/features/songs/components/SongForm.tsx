import { useState, useEffect } from 'react';
import {
  TextInput,
  NumberInput,
  Button,
  Stack,
  Group,
  Select,
  Image,
  ActionIcon,
  Text,
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconUpload, IconX, IconPhoto } from '@tabler/icons-react';
import { DateInput } from '@mantine/dates';
import { useAlbums } from '../../albums/hooks/useAlbums';
import { productsApi } from '../../../api/products.api';
import { getImageUrl } from '../../../utils/imageUrl';
import type { SongResponse } from '../../../types/song.types';

interface SongFormProps {
  initialData?: SongResponse;
  onSubmit: (data: {
    albumId?: number;
    title: string;
    durationSeconds?: number;
    spotifyUrl?: string;
    musicWriter?: string;
    lyricsWriter?: string;
    trackNumber?: number;
    youtubeUrl?: string;
    releaseDate?: string;
    imageUrl?: string;
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
  const [musicWriter, setMusicWriter] = useState('');
  const [lyricsWriter, setLyricsWriter] = useState('');
  const [trackNumber, setTrackNumber] = useState<number | string>('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [releaseDate, setReleaseDate] = useState<Date | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setAlbumId(initialData.albumId?.toString() ?? null);
      setTitle(initialData.title);
      setDurationSeconds(initialData.durationSeconds ?? '');
      setSpotifyUrl(initialData.spotifyUrl ?? '');
      setMusicWriter(initialData.musicWriter ?? '');
      setLyricsWriter(initialData.lyricsWriter ?? '');
      setTrackNumber(initialData.trackNumber ?? '');
      setYoutubeUrl(initialData.youtubeUrl ?? '');
      setReleaseDate(initialData.releaseDate ? new Date(initialData.releaseDate) : null);
      setImageUrl(initialData.imageUrl ?? '');
    }
  }, [initialData]);

  const albumOptions = (albums ?? []).map((a) => ({
    value: a.id.toString(),
    label: a.title,
  }));

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;
    setUploading(true);
    try {
      const res = await productsApi.uploadImage(files[0], 'songs');
      setImageUrl(res.url ?? '');
    } catch {
      // Error handling via notifications om du vill
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      albumId: albumId ? Number(albumId) : undefined,
      title,
      durationSeconds: durationSeconds !== '' ? Number(durationSeconds) : undefined,
      spotifyUrl: spotifyUrl || undefined,
      musicWriter: musicWriter || undefined,
      lyricsWriter: lyricsWriter || undefined,
      trackNumber: trackNumber !== '' ? Number(trackNumber) : undefined,
      youtubeUrl: youtubeUrl || undefined,
      releaseDate: releaseDate ? releaseDate.toISOString() : undefined,
      imageUrl: imageUrl || undefined,
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

        <Group grow>
          <TextInput
            label="Musik av"
            placeholder="Vem skrev musiken"
            value={musicWriter}
            onChange={(e) => setMusicWriter(e.currentTarget.value)}
            error={errors?.musicWriter}
          />

          <TextInput
            label="Text av"
            placeholder="Vem skrev texten"
            value={lyricsWriter}
            onChange={(e) => setLyricsWriter(e.currentTarget.value)}
            error={errors?.lyricsWriter}
          />
        </Group>

        <TextInput
          label="Spotify URL"
          placeholder="https://open.spotify.com/track/..."
          value={spotifyUrl}
          onChange={(e) => setSpotifyUrl(e.currentTarget.value)}
          error={errors?.spotifyUrl}
        />

        <TextInput
          label="YouTube URL"
          placeholder="https://www.youtube.com/watch?v=..."
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.currentTarget.value)}
          error={errors?.youtubeUrl}
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

        {/* Låtbild */}
        <div>
          <Text size="sm" fw={500} mb={4}>Låtbild</Text>
          {imageUrl ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Image
                src={getImageUrl(imageUrl)}
                alt="Låtbild"
                radius="md"
                maw={200}
              />
              <ActionIcon
                color="red"
                variant="filled"
                size="sm"
                radius="xl"
                style={{ position: 'absolute', top: 4, right: 4 }}
                onClick={() => setImageUrl('')}
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
            {initialData ? 'Uppdatera' : 'Skapa låt'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}