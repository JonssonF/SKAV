import { Card, Title, Group, Text, Badge } from '@mantine/core';

interface GigCardProps {
  gig: {
    id: number;
    title: string;
    description: string;
    location: string;
    date: string;
    price?: number;
    ticketUrl?: string;
  };
  upcoming?: boolean;
}

export function GigCard({ gig, upcoming }: GigCardProps) {
  const date = new Date(gig.date);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Title order={3}>{gig.title}</Title>
        {upcoming && <Badge color="green">Kommande</Badge>}
      </Group>

      <Text c="dimmed" mb="sm">{gig.description}</Text>

      <Group gap="lg">
        <Text size="sm">📍 {gig.location}</Text>
        <Text size="sm">
          📅 {date.toLocaleDateString('sv-SE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
        <Text size="sm">
          🕐 {date.toLocaleTimeString('sv-SE', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        {gig.price != null && (
          <Text size="sm">💰 {gig.price} kr</Text>
        )}
      </Group>

      {gig.ticketUrl && (
        <Text size="sm" mt="sm" component="a" href={gig.ticketUrl} target="_blank" c="blue">
          Köp biljetter →
        </Text>
      )}
    </Card>
  );
}