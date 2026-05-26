import { useState, useEffect } from 'react';
import {
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Stack,
  Group,
  Switch,
} from '@mantine/core';
import type { ProductResponse } from '../../../types/product.types';

interface ProductFormProps {
  initialData?: ProductResponse;
  onSubmit: (data: {
    title: string;
    description: string;
    price: number;
    category?: string;
    isSignable: boolean;
    signingPrice?: number;
  }) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function ProductForm({ initialData, onSubmit, loading, errors }: ProductFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>(0);
  const [category, setCategory] = useState('');
  const [isSignable, setIsSignable] = useState(false);
  const [signingPrice, setSigningPrice] = useState<number | string>('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setPrice(initialData.price);
      setCategory(initialData.category ?? '');
      setIsSignable(initialData.isSignable);
      setSigningPrice(initialData.signingPrice ?? '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      price: price !== '' ? Number(price) : 0,
      category: category || undefined,
      isSignable,
      signingPrice: isSignable && signingPrice !== '' ? Number(signingPrice) : undefined,
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
          label="Kategori"
          placeholder="T.ex. Kläder, Musik, Övrigt"
          value={category}
          onChange={(e) => setCategory(e.currentTarget.value)}
          error={errors?.category}
        />

        <Switch
          label="Kan signeras"
          checked={isSignable}
          onChange={(e) => setIsSignable(e.currentTarget.checked)}
        />

        {isSignable && (
          <NumberInput
            label="Signeringspris (kr)"
            description="Lämna tomt eller 0 för gratis signering"
            placeholder="0"
            value={signingPrice}
            onChange={(val) => setSigningPrice(val !== undefined ? Number(val) : '')}
            min={0}
          />
        )}

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            {initialData ? 'Uppdatera' : 'Skapa produkt'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}