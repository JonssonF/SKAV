import { Container, Title, Text, Stack, Group, Loader, Alert } from '@mantine/core';
import { useGigs } from '../features/gigs/hooks/useGigs';
import { GigCard } from '../features/gigs/components/GigCard';

export function GigsPage() {
  const { data: gigs, isLoading, error } = useGigs();

  if (isLoading) {
    return (
      <Container py="xl">
        <Group justify="center"><Loader size="lg" /></Group>
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