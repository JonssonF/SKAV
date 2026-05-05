import {
  Container,
  Title,
  Text,
  Card,
  Stack,
  Group,
  Badge,
  Loader,
  Alert,
  Anchor,
} from '@mantine/core';
import { useGigs } from '../hooks/useGigs';

export function GigsSection() {
  const { data: gigs, isLoading, error } = useGigs();

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Group justify="center">
          <Loader size="lg" />
        </Group>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert color="red" title="Något gick fel">
          Kunde inte hämta spelningar.
        </Alert>
      </Container>
    );
  }

  if (!gigs || gigs.length === 0) {
    return (
      <Container size="lg" py="xl">
        <Title order={2} mb="lg">Spelningar</Title>
        <Text c="dimmed">Inga spelningar inlagda än.</Text>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg" ta="center">Spelningar</Title>
      <Stack gap="md">
        {gigs.map((gig) => (
          <Card key={gig.id} shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" wrap="wrap">
              <div>
                <Title order={3}>{gig.title}</Title>
                <Text c="dimmed" size="sm">
                  {gig.location} • {new Date(gig.date).toLocaleDateString('sv-SE')}
                </Text>
                {gig.description && (
                  <Text mt="xs" size="sm">{gig.description}</Text>
                )}
              </div>
              <Group gap="sm">
                {gig.price != null && (
                  <Badge variant="light" size="lg">
                    {gig.price > 0 ? `${gig.price} kr` : 'Gratis'}
                  </Badge>
                )}
                {gig.ticketUrl && (
                  <Anchor href={gig.ticketUrl} target="_blank" size="sm">
                    Biljetter
                  </Anchor>
                )}
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}