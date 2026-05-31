import { useState } from 'react';
import {
  Container, Text, Card, Stack, Group, Badge,
  Loader, Alert, Button, Pagination, Divider,
} from '@mantine/core';
import { IconMapPin, IconCalendar, IconClock, IconTicket } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useGigs } from '../hooks/useGigs';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import { NextGigBanner } from '../components/NextGigBanner';
import type { GigResponse } from '../../../types/gig.types';

const PAGE_SIZE = 5;

const isPast = (date: string) => new Date(date) < new Date();

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('sv-SE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });

const getGoogleMapsUrl = (adress: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adress)}`;

// Återanvändbart spelningskort för kommande och tidigare
function GigCard({ gig, index }: { gig: GigResponse; index: number }) {
  const past = isPast(gig.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{ opacity: past ? 0.55 : 1 }}
      >
        <Group justify="space-between" wrap="wrap" gap="md">
          <Stack gap={6}>
            <Text
              fw={800}
              size="lg"
              style={{ fontFamily: '"Permanent Marker", cursive' }}
            >
              {gig.title}
            </Text>

            <Group gap="xs" c="dimmed">
              <IconCalendar size={14} />
              <Text size="sm" tt="capitalize">{formatDate(gig.date)}</Text>
            </Group>

            <Group gap="xs" c="dimmed">
              <IconClock size={14} />
              <Text size="sm">{formatTime(gig.date)}</Text>
            </Group>

            <Group gap="xs" c="dimmed">
              <IconMapPin size={14} />
              <Text size="sm">{gig.location}</Text>
            </Group>

            {gig.description && (
              <Text size="sm" mt={4} maw={420}>{gig.description}</Text>
            )}
          </Stack>

          <Stack gap="sm" align="flex-end">
            {gig.price != null && (
              <Badge variant="light" color={past ? 'gray' : 'green'} size="lg">
                {gig.price > 0 ? `${gig.price} kr` : 'Gratis'}
              </Badge>
            )}
            <Group gap="xs">
              {gig.ticketUrl && !past && (
                <Button
                  component="a"
                  href={gig.ticketUrl}
                  target="_blank"
                  variant="gradient"
                  gradient={{ from: 'red', to: 'gray' }}
                  size="xs"
                  leftSection={<IconTicket size={13} />}
                >
                  Biljetter
                </Button>
              )}
              {gig.adress && (
                <Button
                  component="a"
                  href={getGoogleMapsUrl(gig.adress)}
                  target="_blank"
                  variant="gradient"
                  gradient={{ from: 'red', to: 'gray' }}
                  size="xs"
                  leftSection={<IconMapPin size={13} />}
                >
                  Hitta hit
                </Button>
              )}
            </Group>
          </Stack>
        </Group>
      </Card>
    </motion.div>
  );
}

// Paginerad lista med "visa fler"-knapp
function GigList({ gigs }: { gigs: GigResponse[] }) {
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);

  const total = gigs.length;
  const showInitial = 3;

  if (!expanded) {
    return (
      <>
        <Stack gap="sm">
          {gigs.slice(0, showInitial).map((gig, i) => (
            <GigCard key={gig.id} gig={gig} index={i} />
          ))}
        </Stack>
        {total > showInitial && (
          <Group justify="center" mt="md">
            <Button variant="light" color="violet" onClick={() => setExpanded(true)}>
              Visa fler ({total - showInitial} till)
            </Button>
          </Group>
        )}
      </>
    );
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const visible = gigs.slice(start, start + PAGE_SIZE);

  return (
    <>
      <Stack gap="sm">
        {visible.map((gig, i) => (
          <GigCard key={gig.id} gig={gig} index={i} />
        ))}
      </Stack>
      {totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination total={totalPages} value={page} onChange={setPage} color="violet" />
        </Group>
      )}
    </>
  );
}

export function GigsSection() {
  const { data: gigs, isLoading, error } = useGigs();

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Group justify="center"><Loader size="lg" /></Group>
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

  // Dela upp i kommande och tidigare
  const upcoming = [...(gigs ?? [])]
    .filter((g) => !isPast(g.date))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // närmast först

  const past = [...(gigs ?? [])]
    .filter((g) => isPast(g.date))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // senaste först

  const nextGig = upcoming[0] ?? null;
  const remainingUpcoming = upcoming.slice(1); // kommande utan nästa

  return (
    <Container size="lg" py="xl">
      <SectionTitle text="Spelningar" />

      {/* Nästa spelning med nedräkning */}
      {nextGig && <NextGigBanner gig={nextGig} />}

      {/* Kommande spelningar (exkl. nästa) */}
      {remainingUpcoming.length > 0 && (
        <>
          <Text fw={700} size="lg" mb="sm" c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>
            Kommande
          </Text>
          <GigList gigs={remainingUpcoming} />
        </>
      )}

      {/* Skiljelinje om båda sektionerna finns */}
      {remainingUpcoming.length > 0 && past.length > 0 && (
        <Divider my="xl" />
      )}
      {remainingUpcoming.length === 0 && past.length > 0 && (
        <Divider my="xl" />
      )}

      {/* Tidigare spelningar */}
      {past.length > 0 && (
        <>
          <Text fw={700} size="lg" mb="sm" c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>
            Tidigare spelningar
          </Text>
          <GigList gigs={past} />
        </>
      )}

      {/* Ingenting alls */}
      {!nextGig && upcoming.length === 0 && past.length === 0 && (
        <Text c="dimmed">Inga spelningar inlagda än.</Text>
      )}
    </Container>
  );
}