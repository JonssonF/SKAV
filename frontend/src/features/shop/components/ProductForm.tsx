import { useState, useEffect } from 'react';
import {
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Stack,
  Group,
} from '@mantine/core';
import type { ProductResponse } from '../../../types/product.types';

interface ProductFormProps {
  initialData?: ProductResponse;
  onSubmit: (data: {
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
    category?: string;
  }) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function ProductForm({ initialData, onSubmit, loading, errors }: ProductFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>(0);
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setPrice(initialData.price);
      setImageUrl(initialData.imageUrl ?? '');
      setCategory(initialData.category ?? '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      price: price !== '' ? Number(price) : 0,
      imageUrl: imageUrl || undefined,
      category: category || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Titel"
          placeholder="T.ex. SKAV T-shirt"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          error={errors?.title}
          required
        />

        <Textarea
          label="Beskrivning"
          placeholder="Beskriv produkten..."
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          error={errors?.description}
          minRows={3}
          required
        />

        <NumberInput
          label="Pris (kr)"
          placeholder="0"
          value={price}
          onChange={(val) => setPrice(Number(val))}
          error={errors?.price}
          min={0}
          required
        />

        <TextInput
          label="Bild-URL"
          placeholder="https://..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.currentTarget.value)}
          error={errors?.imageUrl}
        />

        <TextInput
          label="Kategori"
          placeholder="T.ex. Kläder, Musik, Övrigt"
          value={category}
          onChange={(e) => setCategory(e.currentTarget.value)}
          error={errors?.category}
        />

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            {initialData ? 'Uppdatera' : 'Skapa produkt'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}