import { useState, useEffect } from 'react';
import {
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Stack,
  Group,
} from '@mantine/core';
import type { MemberResponse } from '../../../types/member.types';

interface MemberFormProps {
  initialData?: MemberResponse;
  onSubmit: (data: {
    name: string;
    role?: string;
    bio?: string;
    quote?: string;
    imageUrl?: string;
    displayOrder: number;
  }) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function MemberForm({ initialData, onSubmit, loading, errors }: MemberFormProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [quote, setQuote] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number | string>(0);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRole(initialData.role ?? '');
      setBio(initialData.bio ?? '');
      setQuote(initialData.quote ?? '');
      setImageUrl(initialData.imageUrl ?? '');
      setDisplayOrder(initialData.displayOrder);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      name,
      role: role || undefined,
      bio: bio || undefined,
      quote: quote || undefined,
      imageUrl: imageUrl || undefined,
      displayOrder: displayOrder !== '' ? Number(displayOrder) : 0,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Namn"
          placeholder="T.ex. Anna Svensson"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          error={errors?.name}
          required
        />

        <TextInput
          label="Roll"
          placeholder="T.ex. Basist, Gitarrist, Sångare"
          value={role}
          onChange={(e) => setRole(e.currentTarget.value)}
          error={errors?.role}
        />

        <Textarea
          label="Bio"
          placeholder="Berätta lite om dig själv..."
          value={bio}
          onChange={(e) => setBio(e.currentTarget.value)}
          error={errors?.bio}
          minRows={3}
          autosize
        />

        <TextInput
          label="Citat"
          placeholder="Valfritt citat"
          value={quote}
          onChange={(e) => setQuote(e.currentTarget.value)}
          error={errors?.quote}
        />

        <TextInput
          label="Bild-URL"
          placeholder="https://..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.currentTarget.value)}
          error={errors?.imageUrl}
        />

        <NumberInput
          label="Visningsordning"
          placeholder="Lägre nummer visas först"
          value={displayOrder}
          onChange={(value) => setDisplayOrder(Number(value))}
          error={errors?.displayOrder}
          min={0}
        />

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            {initialData ? 'Uppdatera' : 'Lägg till medlem'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}