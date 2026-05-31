import { useEffect, useState } from 'react';
import {
  Paper, Text, Group, Stack, Badge, Button, Box, Divider,
} from '@mantine/core';
import {
  IconMapPin, IconCalendar, IconClock, IconTicket, IconCoin,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useMantineColorScheme } from '@mantine/core';
import type { GigResponse } from '../../../types/gig.types';

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getCountdown(targetDate: string): CountdownValues {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Box ta="center">
      <Paper
        radius="md"
        p="sm"
        style={{
          background: isDark ? 'var(--mantine-color-dark-5)' : 'var(--mantine-color-gray-1)',
          border: '2px solid var(--mantine-color-red-3)',
          width: 80,        // fast bredd istället för minWidth
          height: 72,       // fast höjd
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          fw={900}
          size="2rem"
          lh={1}
          style={{
            fontFamily: '"Orbitron", monospace',
            color: 'var(--mantine-color-black-7)',
          }}
        >
          {String(value).padStart(2, '0')}
        </Text>
      </Paper>
      <Text size="xs" fw={600} tt="uppercase" c="dimmed" mt={6}>
        {label}
      </Text>
    </Box>
  );
}

function Separator() {
  return (
    <Text
      fw={900}
      size="xl"
      c="red"
      mb={50}   // högre mb skjuter kolon uppåt relativt boxarna
      style={{ userSelect: 'none', lineHeight: 1 }}
    >
      :
    </Text>
  );
}

export function NextGigBanner({ gig }: { gig: GigResponse }) {
  const [countdown, setCountdown] = useState(() => getCountdown(gig.date));
  
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const id = setInterval(() => setCountdown(getCountdown(gig.date)), 1000);
    return () => clearInterval(id);
  }, [gig.date]);

  const formattedDate = new Date(gig.date).toLocaleDateString('sv-SE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const formattedTime = new Date(gig.date).toLocaleTimeString('sv-SE', {
    hour: '2-digit', minute: '2-digit',
  });
  const mapsUrl = gig.adress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gig.adress)}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Paper
        withBorder
        radius="lg"
        p="xl"
        mb="xl"
        style={{
          background: isDark
  ? 'linear-gradient(135deg, var(--mantine-color-dark-7) 0%, var(--mantine-color-dark-6) 100%)'
  : 'linear-gradient(135deg, var(--mantine-color-gray-0) 0%, var(--mantine-color-pink-0) 100%)',
          borderColor: 'var(--mantine-color-red-3)',
          borderWidth: 2,
        }}
      >
        {/* Etikett */}
        <Group justify="center" mb="lg" gap="xs">
          <Badge size="xl" variant="gradient" gradient={{ from: 'red', to: 'gray' }}>
            🎸 Nästa spelning
          </Badge>
        </Group>

        {/* Centrerad spelningsinfo */}
        <Stack align="center" gap="sm" mb="xl">
          <Text
            fw={900}
            ta="center"
            style={{
              fontFamily: '"Permanent Marker", cursive',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: 1.1,
            }}
          >
            {gig.title}
          </Text>

          <Group gap="xl" justify="center" wrap="wrap">
            <Group gap="xs" c="dimmed">
              <IconCalendar size={17} />
              <Text size="md" tt="capitalize">{formattedDate}</Text>
            </Group>

            <Group gap="xs" c="dimmed">
              <IconClock size={17} />
              <Text size="md">{formattedTime}</Text>
            </Group>

            <Group gap="xs" c="dimmed">
              <IconMapPin size={17} />
              <Text size="md">{gig.location}</Text>
            </Group>

            {gig.price != null && (
              <Group gap="xs" c="green">
                <IconCoin size={20} />
                <Text size="md" fw={700} c="green">
                  {gig.price > 0 ? `${gig.price} kr` : 'Gratis'}
                </Text>
              </Group>
            )}
          </Group>

          {gig.description && (
            <Text size="sm" c="dimmed" ta="center" maw={480}>{gig.description}</Text>
          )}

          <Group mt="xs" gap="sm" justify="center">
            {gig.ticketUrl && (
              <Button
                component="a"
                href={gig.ticketUrl}
                target="_blank"
                variant="filled"
                color="red"
                leftSection={<IconTicket size={15} />}
              >
                Köp biljetter
              </Button>
            )}
            {mapsUrl && (
              <Button
                component="a"
                href={mapsUrl}
                target="_blank"
                variant="outline"
                color="red"
                leftSection={<IconMapPin size={15} />}
              >
                Hitta hit
              </Button>
            )}
          </Group>
        </Stack>

        <Divider mb="xl" color="red.2" />

        {/* Nedräkning */}
        <Stack align="center" gap={4}>
          <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb={8}>
            Det brakar loss om
          </Text>
          <Group gap="xs" align="flex-end" wrap="nowrap">
            <CountdownBox value={countdown.days} label="dagar" />
            <Separator />
            <CountdownBox value={countdown.hours} label="timmar" />
            <Separator />
            <CountdownBox value={countdown.minutes} label="minuter" />
            <Separator />
            <CountdownBox value={countdown.seconds} label="sekunder" />
          </Group>
        </Stack>
      </Paper>
    </motion.div>
  );
}