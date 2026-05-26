import { useLocalStorage } from '@mantine/hooks';
import { useMediaQuery } from '@mantine/hooks';
import { IMAGE_BASE_URL } from '../../utils/imageUrl';

export function HeroSection() {
  const [colorScheme] = useLocalStorage<'light' | 'dark'>({
    key: 'color-scheme',
    defaultValue: 'dark',
  });
  
  const isMobile = useMediaQuery('(max-width: 48em)');

  const heroImage = colorScheme === 'dark'
    ? `${IMAGE_BASE_URL}/images/sections/hero-dark.png`
    : `${IMAGE_BASE_URL}/images/sections/hero-light.png`;

  const bgColor = colorScheme === 'dark'
    ? 'var(--mantine-color-dark-7)'
    : 'var(--mantine-color-white)';

  const isDark = colorScheme === 'dark';

  return (
    <div
      style={{
        minHeight: isMobile ? '40vh' : '80vh',
        backgroundImage: `url(${heroImage})`,
        backgroundSize: isDark ? 'cover' : 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: isDark ? 'center' : 'center top',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isDark
            ? `linear-gradient(to bottom, transparent 30%, ${bgColor} 100%)`
            : `linear-gradient(to bottom, transparent 60%, ${bgColor} 100%)`,
        }}
      />
    </div>
  );
}