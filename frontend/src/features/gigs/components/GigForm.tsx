import { useState, useEffect } from 'react';
import {
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Stack,
  Group,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import type { GigResponse } from '../../../types/gig.types';

interface GigFormProps {
  initialData?: GigResponse;
  onSubmit: (data: {
    title: string;
    description: string;
    location: string;
    date: string;
    adress?: string;
    price?: number;
    notes?: string;
    ticketUrl?: string;
  }) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function GigForm({ initialData, onSubmit, loading, errors }: GigFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState<string | null>(null);
  const [adress, setAdress] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [notes, setNotes] = useState('');
  const [ticketUrl, setTicketUrl] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setLocation(initialData.location);
      setDate(initialData.date);
      setAdress(initialData.adress ?? '');
      setPrice(initialData.price ?? '');
      setNotes(initialData.notes ?? '');
      setTicketUrl(initialData.ticketUrl ?? '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    onSubmit({
      title,
      description,
      location,
      date: new Date(date).toISOString(),
      adress: adress || undefined,
      price: price !== '' ? Number(price) : 0,
      notes: notes || undefined,
      ticketUrl: ticketUrl || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Titel"
          placeholder="T.ex. Sommarfestivalen"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          error={errors?.title}
          required
        />

        <Textarea
          label="Beskrivning"
          placeholder="Beskriv spelningen..."
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          error={errors?.description}
          minRows={3}
          required
        />

        <TextInput
          label="Plats"
          placeholder="T.ex. Pustervik, Göteborg"
          value={location}
          onChange={(e) => setLocation(e.currentTarget.value)}
          error={errors?.location}
          required
        />

        <DateTimePicker
          label="Datum och tid"
          placeholder="Välj datum och tid"
          value={date}
          onChange={setDate}
          error={errors?.date}
          required
        />

        <TextInput
          label="Adress"
          placeholder="Gatuadress (valfritt)"
          value={adress}
          onChange={(e) => setAdress(e.currentTarget.value)}
          error={errors?.adress}
        />

        <NumberInput
          label="Pris (kr)"
          placeholder="0 = gratis"
          value={price}
          onChange={(value) => setPrice(Number(value))}
          error={errors?.price}
          min={0}
        />

        <TextInput
          label="Biljettlänk"
          placeholder="https://..."
          value={ticketUrl}
          onChange={(e) => setTicketUrl(e.currentTarget.value)}
          error={errors?.ticketUrl}
        />

        <Textarea
          label="Interna anteckningar"
          placeholder="Syns bara för admin (valfritt)"
          value={notes}
          onChange={(e) => setNotes(e.currentTarget.value)}
          error={errors?.notes}
          minRows={2}
        />

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            {initialData ? 'Uppdatera' : 'Skapa spelning'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}