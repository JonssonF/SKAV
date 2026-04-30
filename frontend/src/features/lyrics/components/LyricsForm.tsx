import { Stack, Textarea, Button, Group } from '@mantine/core';
import { useState, useEffect } from 'react';
import type { LyricsResponse } from '../../../types/lyrics.types';

interface LyricsFormProps {
  songId: number;
  initialData?: LyricsResponse | null;
  onSubmit: (body: string) => void;
  loading?: boolean;
}

export function LyricsForm({ songId, initialData, onSubmit, loading }: LyricsFormProps) {
  const [body, setBody] = useState('');

  useEffect(() => {
    if (initialData) {
      setBody(initialData.body);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(body);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Textarea
          label="Låttext"
          placeholder="Skriv låttexten här..."
          value={body}
          onChange={(e) => setBody(e.currentTarget.value)}
          minRows={12}
          autosize
          required
        />

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            {initialData ? 'Uppdatera' : 'Spara låttext'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}