import { useState, useEffect } from 'react';
import { TextInput, Textarea, Switch, Button, Stack, Group } from '@mantine/core';
import type { SongProposalResponse } from '../../../types/songProposal.types';

interface SongProposalFormProps {
  initialData?: SongProposalResponse;
  onSubmit: (data: {
    title: string;
    description?: string;
    lyricsBody?: string;
    isActive: boolean;
  }) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function SongProposalForm({ initialData, onSubmit, loading, errors }: SongProposalFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lyricsBody, setLyricsBody] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description ?? '');
      setLyricsBody(initialData.lyricsBody ?? '');
      setIsActive(initialData.isActive);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description: description || undefined,
      lyricsBody: lyricsBody || undefined,
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Titel"
          placeholder="T.ex. Midnattsregn"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          error={errors?.title}
          required
        />

        <Textarea
          label="Beskrivning"
          placeholder="Vad handlar låten om?"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          error={errors?.description}
          minRows={3}
          autosize
        />

        <Textarea
          label="Låttext / textidé"
          placeholder="Klistra in text eller skriv en idé..."
          value={lyricsBody}
          onChange={(e) => setLyricsBody(e.currentTarget.value)}
          error={errors?.lyricsBody}
          minRows={5}
          autosize
        />

        <Switch
          label="Aktiv (kan röstast på)"
          checked={isActive}
          onChange={(e) => setIsActive(e.currentTarget.checked)}
        />

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            {initialData ? 'Uppdatera' : 'Skapa förslag'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}