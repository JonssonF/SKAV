import { useState } from 'react';
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Text,
  Divider,
  Alert,
} from '@mantine/core';
import type { CartItem } from '../hooks/useCart';

interface CheckoutModalProps {
  opened: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  onSubmit: (data: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
    address?: string;
    city?: string;
    postalCode?: string;
  }) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function CheckoutModal({
  opened,
  onClose,
  items,
  totalPrice,
  onSubmit,
  loading,
  errors,
}: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email,
      phone: phone || undefined,
      message: message || undefined,
      address: address || undefined,
      city: city || undefined,
      postalCode: postalCode || undefined,
    });
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Skicka beställning" size="lg">
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Fyll i dina uppgifter så hör vi av oss med betalningsinformation.
        </Text>

        {/* Ordersammanfattning */}
        {items.map((item) => {
          const attrs = JSON.parse(item.variant.attributes) as Record<string, string>;
          const attrText = Object.entries(attrs)
            .map(([key, val]) => `${key}: ${val}`)
            .join(', ');
          const price = item.variant.priceOverride ?? item.product.price;

          return (
            <Group key={item.variant.id} justify="space-between">
              <div>
                <Text size="sm" fw={500}>
                  {item.quantity}x {item.product.title}
                </Text>
                {attrText && (
                  <Text size="xs" c="dimmed">{attrText}</Text>
                )}
              </div>
              <Text size="sm">{price * item.quantity} kr</Text>
            </Group>
          );
        })}

        <Divider />

        <Group justify="space-between">
          <Text fw={700}>Totalt</Text>
          <Text fw={700}>{totalPrice} kr</Text>
        </Group>

        <Divider />

        {/* Kontaktuppgifter */}
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
            <TextInput
              label="Adress"
              placeholder="Gatuadress (valfritt)"
              value={address}
              onChange={(e) => setAddress(e.currentTarget.value)}
              error={errors?.address}
            />

            <Group grow>
              <TextInput
                label="Postnummer"
                placeholder="12345"
                value={postalCode}
                onChange={(e) => setPostalCode(e.currentTarget.value)}
                error={errors?.postalCode}
              />

              <TextInput
                label="Ort"
                placeholder="Derome"
                value={city}
                onChange={(e) => setCity(e.currentTarget.value)}
                error={errors?.city}
              />
            </Group>
            <Textarea
              label="Meddelande"
              placeholder="Önskemål, leveransinfo etc. (valfritt)"
              value={message}
              onChange={(e) => setMessage(e.currentTarget.value)}
              error={errors?.message}
              minRows={2}
            />

            <Button type="submit" fullWidth loading={loading}>
              Skicka beställning
            </Button>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
}