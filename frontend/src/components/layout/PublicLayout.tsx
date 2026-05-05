import { Group, Button, Container, ActionIcon } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { useLocalStorage } from '@mantine/hooks';

const navItems = [
  { label: 'Hem', href: '#hem' },
  { label: 'Om', href: '#om' },
  { label: 'Bandet', href: '#bandet' },
  { label: 'Spelningar', href: '#spelningar' },
  { label: 'Boka', href: '#boka' },
  { label: 'Musik', href: '#musik' },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [colorScheme, setColorScheme] = useLocalStorage<'light' | 'dark'>({
    key: 'color-scheme',
    defaultValue: 'dark',
  });

  const isAdmin = user?.roles.includes('Admin') ?? false;
  const isEditor = user?.roles.includes('Editor') ?? false;

  const scrollTo = (href: string) => {
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'var(--mantine-color-body)',
          opacity: 0.95,
          borderBottom: '1px solid var(--mantine-color-default-border)',
        }}
      >
        <Container size="lg">
          <Group h={60} justify="space-between">
            <span
              style={{ fontSize: '1.4rem', fontWeight: 700, cursor: 'pointer' }}
              onClick={() => scrollTo('#hem')}
            >
              SKAV - Byns bästa band
            </span>

            <Group gap="xs">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="subtle"
                  size="sm"
                  color="gray"
                  onClick={() => scrollTo(item.href)}
                >
                  {item.label}
                </Button>
              ))}

              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
              >
                {colorScheme === 'dark' ? '☀️' : '🌙'}
              </ActionIcon>

              {isAuthenticated && (isAdmin || isEditor) && (
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => navigate('/admin')}
                >
                  Admin
                </Button>
              )}
            </Group>
          </Group>
        </Container>
      </header>

      <main style={{ paddingTop: 60 }}>
        {children}
      </main>
    </>
  );
}