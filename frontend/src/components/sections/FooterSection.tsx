import { useState } from 'react';
import { Container, Group, Text, Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { UnsubscribeModal } from '../../features/subscribers/components/UnsubscribeModal';

export function FooterSection() {
  const [colorScheme] = useLocalStorage<'light' | 'dark'>({
    key: 'color-scheme',
    defaultValue: 'dark',
  });

  const [unsubOpen, setUnsubOpen] = useState(false);

  const bottomImage = colorScheme === 'dark'
    ? '/images/sections/bottom-dark.png'
    : '/images/sections/bottom-light.jpg';

  const bgColor = colorScheme === 'dark'
    ? 'var(--mantine-color-dark-7)'
    : 'var(--mantine-color-white)';

  return (
    <footer
      style={{
        backgroundImage: `url(${bottomImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            to bottom,
            ${bgColor} 0%,
            transparent 40%,
            transparent 60%,
            ${bgColor} 100%
          )`,
        }}
      />
<Container
  size="lg"
  style={{
    position: 'relative',
    zIndex: 1,
    paddingTop: '25vh',
    paddingBottom: 40,
  }}
>
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
      <Text size="sm" c="dimmed" component="a" href="https://facebook.com" target="_blank">
        Facebook
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
      <Text size="sm" c="dimmed" component="a" href="mailto:kontakt@skav.se">
        Kontakt
      </Text>
      <Text size="sm" c="dimmed" component="a" href="https://www.instagram.com/skav.bandet" target="_blank">
        Instagram
      </Text>
      <Text size="sm" c="dimmed" component="a" href="https://facebook.com" target="_blank">
        Facebook
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
  );
}