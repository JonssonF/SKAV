import { useState } from 'react';
import {
  Container,
  Text,
  Card,
  Stack,
  Group,
  Badge,
  Loader,
  Alert,
  Anchor,
  Button,
  Pagination,
} from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react';
import { useGigs } from '../hooks/useGigs';
import { SectionTitle } from '../../../components/ui/SectionTitle';

const INITIAL_COUNT = 5;
const PAGE_SIZE = 10;

export function GigsSection() {
  const { data: gigs, isLoading, error } = useGigs();
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);
  // Sortera: kommande först (närmast datum högst upp), passerade sist
  const sortedGigs = [...(gigs ?? [])].sort((a, b) => {
  const aPast = new Date(a.date) < new Date();
  const bPast = new Date(b.date) < new Date();
  if (aPast !== bPast) return aPast ? 1 : -1; // kommande före passerade
  if (aPast) return new Date(b.date).getTime() - new Date(a.date).getTime(); // passerade: senaste först
  return new Date(a.date).getTime() - new Date(b.date).getTime(); // kommande: närmast först
});
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
        <SectionTitle text="Spelningar" />
        <Text c="dimmed">Inga spelningar inlagda än.</Text>
      </Container>
    );
  }

  const total = sortedGigs.length;
  const showCount = expanded ? PAGE_SIZE : INITIAL_COUNT;
  const totalPages = expanded ? Math.ceil(total / PAGE_SIZE) : 1;
  const start = expanded ? (page - 1) * PAGE_SIZE : 0;
  const visibleGigs = sortedGigs.slice(start, start + showCount);
  const showExpandButton = !expanded && total > INITIAL_COUNT;

  const isPast = (date: string) => new Date(date) < new Date();

  const getGoogleMapsUrl = (adress: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adress)}`;

  return (
    <Container size="lg" py="xl">
      <SectionTitle text="Spelningar" />
      <Stack gap="md">
        {visibleGigs.map((gig) => {
          const past = isPast(gig.date);

          return (
            <Card
              key={gig.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ opacity: past ? 0.6 : 1 }}
            >
              <Group justify="space-between" wrap="wrap">
                <div>
                  <Group gap="sm" mb={4}>
                    <Text fw={700} size="lg">{gig.title}</Text>
                    {past && (
                      <Badge variant="light" color="gray" size="sm">Spelat</Badge>
                    )}
                  </Group>
                  <Text c="dimmed" size="sm">
                    {gig.location} • {new Date(gig.date).toLocaleDateString('sv-SE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
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
                  {gig.ticketUrl && !past && (
                    <Anchor href={gig.ticketUrl} target="_blank" size="sm">
                      Biljetter
                    </Anchor>
                  )}
                  {gig.adress && (
                    <Button
                      component="a"
                      href={getGoogleMapsUrl(gig.adress)}
                      target="_blank"
                      variant="light"
                      size="xs"
                      leftSection={<IconMapPin size={14} />}
                    >
                      Hitta hit
                    </Button>
                  )}
                </Group>
              </Group>
            </Card>
          );
        })}
      </Stack>

      {showExpandButton && (
        <Group justify="center" mt="md">
          <Button
            variant="light"
            onClick={() => {
              setExpanded(true);
              setPage(1);
            }}
          >
            Visa fler ({total - INITIAL_COUNT} till)
          </Button>
        </Group>
      )}

      {expanded && totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            total={totalPages}
            value={page}
            onChange={setPage}
          />
        </Group>
      )}
    </Container>
  );
}