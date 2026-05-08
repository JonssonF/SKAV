import { useLocalStorage } from '@mantine/hooks';
import { useMediaQuery } from '@mantine/hooks';

export function HeroSection() {
  const [colorScheme] = useLocalStorage<'light' | 'dark'>({
    key: 'color-scheme',
    defaultValue: 'dark',
  });

  const isMobile = useMediaQuery('(max-width: 48em)');

  const heroImage = colorScheme === 'dark'
    ? '/images/sections/hero-dark.png'
    : '/images/sections/hero-light.png';

  const bgColor = colorScheme === 'dark'
    ? 'var(--mantine-color-dark-7)'
    : 'var(--mantine-color-white)';

  return (
    <div
      style={{
        minHeight: isMobile ? '40vh' : '80vh',
        backgroundImage: `url(${heroImage})`,
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
            transparent 30%,
            ${bgColor} 100%
          )`,
        }}
      />
    </div>
  );
}