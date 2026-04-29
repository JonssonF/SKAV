import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Stack,
  Badge,
  Loader,
  Alert,
} from '@mantine/core';
import { useGigs } from '../features/gigs/hooks/useGigs';

export function GigsPage() {
  const { data: gigs, isLoading, error } = useGigs();

  if (isLoading) {
    return (
      <Container py="xl">
        <Group justify="center">
          <Loader size="lg" />
        </Group>
      </Container>
    );
  }

  if (error) {
    return (
      <Container py="xl">
        <Alert color="red" title="Något gick fel">
          Kunde inte hämta spelningar. Är backend igång?
        </Alert>
      </Container>
    );
  }

  if (!gigs || gigs.length === 0) {
    return (
      <Container py="xl">
        <Title order={1} mb="lg">Spelningar</Title>
        <Text c="dimmed">Inga spelningar inlagda än.</Text>
      </Container>
    );
  }

  const now = new Date();

  const upcomingGigs = gigs.filter((g) => new Date(g.date) >= now);
  const pastGigs = gigs.filter((g) => new Date(g.date) < now);

  return (
    <Container py="xl">
      <Title order={1} mb="lg">Spelningar</Title>

      {upcomingGigs.length > 0 && (
        <>
          <Title order={2} mb="md" size="h3">Kommande</Title>
          <Stack gap="md" mb="xl">
            {upcomingGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} upcoming />
            ))}
          </Stack>
        </>
      )}

      {pastGigs.length > 0 && (
        <>
          <Title order={2} mb="md" size="h3" c="dimmed">Tidigare</Title>
          <Stack gap="md">
            {pastGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </Stack>
        </>
      )}
    </Container>
  );
}

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

function GigCard({ gig, upcoming }: GigCardProps) {
  const date = new Date(gig.date);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Title order={3}>{gig.title}</Title>
        {upcoming && <Badge color="green">Kommande</Badge>}
      </Group>

      <Text c="dimmed" mb="sm">{gig.description}</Text>

      <Group gap="lg">
        <Text size="sm">
          📍 {gig.location}
        </Text>
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
        <Text
          size="sm"
          mt="sm"
          component="a"
          href={gig.ticketUrl}
          target="_blank"
          c="blue"
        >
          Köp biljetter →
        </Text>
      )}
    </Card>
  );
}