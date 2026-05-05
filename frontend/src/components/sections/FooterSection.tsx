import { Container, Group, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

export function FooterSection() {
  const [colorScheme] = useLocalStorage<'light' | 'dark'>({
    key: 'color-scheme',
    defaultValue: 'dark',
  });

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
          paddingTop: '55vh',
          paddingBottom: 40,
        }}
      >
        <Group justify="space-between">
          <Text size="xl" c="dimmed">
            © {new Date().getFullYear()} SKAV
          </Text>
          <Group gap="md">
            <Text size="xl" c="dimmed" component="a" href="mailto:kontakt@skav.se">
              Kontakt
            </Text>
            <Text size="xl" c="dimmed" component="a" href="https://www.instagram.com/skav.bandet" target="_blank">
              Instagram
            </Text>
            <Text size="xl" c="dimmed" component="a" href="https://facebook.com" target="_blank">
              Facebook
            </Text>
            <Text size="xl" c="dimmed" component="a" href="https://www.youtube.com/@SKAV-BynsB%C3%A4staBand" target="_blank">
              YouTube
            </Text>
            <Text size="xl" c="dimmed" component="a" href="https://open.spotify.com/artist/4ViGGyIDRLTOVghW0qmu8m?si=PqOQzFGxRs2ojOY8x8jDMg" target="_blank">
              Spotify
            </Text>
          </Group>
        </Group>
      </Container>
    </footer>
  );
}