import { useState } from 'react';
import {
  TextInput,
  Textarea,
  Select,
  Button,
  Stack,
  Group,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';

interface BookingFormProps {
  onSubmit: (data: {
    name: string;
    email: string;
    phone?: string;
    eventDate?: string;
    eventType?: string;
    message: string;
  }) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

const eventTypes = [
  { value: 'Fest', label: 'Fest' },
  { value: 'Bröllop', label: 'Bröllop' },
  { value: 'Festival', label: 'Festival' },
  { value: 'Företagsevent', label: 'Företagsevent' },
  { value: 'Annat', label: 'Annat' },
];

export function BookingForm({ onSubmit, loading, errors }: BookingFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventDate, setEventDate] = useState<string | null>(null);
  const [eventType, setEventType] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      name,
      email,
      phone: phone || undefined,
      eventDate: eventDate ? new Date (eventDate).toISOString() : undefined,
      eventType: eventType ?? undefined,
      message,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Namn"
          placeholder="Ditt namn"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          error={errors?.name}
          required
        />

        <TextInput
          label="E-post"
          placeholder="din@email.se"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          error={errors?.email}
          required
        />

        <TextInput
          label="Telefon"
          placeholder="0701234567 (valfritt)"
          value={phone}
          onChange={(e) => setPhone(e.currentTarget.value)}
          error={errors?.phone}
        />

        <DateTimePicker
          label="Önskat datum"
          placeholder="Välj datum och tid (valfritt)"
          value={eventDate}
          onChange={setEventDate} 
          error={errors?.eventDate}
          minDate={tomorrow}
        />

        <Select
          label="Typ av event"
          placeholder="Välj typ (valfritt)"
          data={eventTypes}
          value={eventType}
          onChange={setEventType}
          error={errors?.eventType}
          clearable
        />

        <Textarea
          label="Meddelande"
          placeholder="Berätta om ert event..."
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          error={errors?.message}
          minRows={4}
          required
        />

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            Skicka förfrågan
          </Button>
        </Group>
      </Stack>
    </form>
  );
}