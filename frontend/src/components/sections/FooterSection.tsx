import { useState } from 'react';
import { Container, Group, Text, Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { motion } from 'framer-motion';
import { UnsubscribeModal } from '../../features/subscribers/components/UnsubscribeModal';
import { IMAGE_BASE_URL } from '../../utils/imageUrl';

export function FooterSection() {
  const [colorScheme] = useLocalStorage<'light' | 'dark'>({
    key: 'color-scheme',
    defaultValue: 'light',
  });

  const [unsubOpen, setUnsubOpen] = useState(false);

  const bottomImage = colorScheme === 'dark'
    ? `${IMAGE_BASE_URL}/images/sections/bottom-dark.webp`
    : `${IMAGE_BASE_URL}/images/sections/bottom-light.webp`;

  const bgColor = colorScheme === 'dark'
    ? 'var(--mantine-color-dark-7)'
    : 'var(--mantine-color-white)';

  return (
    <>
      {/* Bandbild med fade in/ut */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(
              to bottom,
              ${bgColor} 0%,
              transparent 20%,
              transparent 80%,
              ${bgColor} 100%
            )`,
            zIndex: 1,
          }}
        />
        <motion.img
          src={bottomImage}
          alt="SKAV"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1 }}
          style={{
            width: '100%',
            display: 'block',
            objectFit: 'cover',
            maxHeight: '50vh',
          }}
        />
      </div>

      {/* Ren footer med bara länkar */}
      <footer
        style={{
          backgroundColor: bgColor,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container size="lg" py="xl">
          <Stack gap="md" align="center" hiddenFrom="sm">
            <Text size="sm" c="dimmed">
              © {new Date().getFullYear()} SKAV
            </Text>
            <Group gap="md" justify="center" wrap="wrap">
              <Text size="sm" c="dimmed" component="a" href="mailto:kontakt@skav.se">
                Kontakt
              </Text>
              <Text size="sm" c="dimmed" component="a" href="https://www.instagram.com/skav.bandet" target="_blank">
                Instagram
              </Text>
              <Text size="sm" c="dimmed" component="a" href="https://www.youtube.com/@SKAV-BynsB%C3%A4staBand" target="_blank">
                YouTube
              </Text>
              <Text
                size="sm"
                c="dimmed"
                style={{ cursor: 'pointer' }}
                onClick={() => setUnsubOpen(true)}
              >
                Avregistrera
              </Text>
            </Group>
          </Stack>

          <Group justify="space-between" visibleFrom="sm">
            <Text size="sm" c="dimmed">
              © {new Date().getFullYear()} SKAV
            </Text>
            <Group gap="md">
              <Text size="sm" c="dimmed" component="a" href="mailto:kontakt@skav.nu">
                Kontakt
              </Text>
              <Text size="sm" c="dimmed" component="a" href="https://www.instagram.com/skav.bandet" target="_blank">
                Instagram
              </Text>
              <Text size="sm" c="dimmed" component="a" href="https://www.youtube.com/@SKAV-BynsB%C3%A4staBand" target="_blank">
                YouTube
              </Text>
              <Text
                size="sm"
                c="dimmed"
                style={{ cursor: 'pointer' }}
                onClick={() => setUnsubOpen(true)}
              >
                Avregistrera nyhetsbrev
              </Text>
            </Group>
          </Group>
        </Container>
        <UnsubscribeModal opened={unsubOpen} onClose={() => setUnsubOpen(false)} />
      </footer>
    </>
  );
}