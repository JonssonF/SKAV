import { useState } from 'react';
import { Group, Button, Container, ActionIcon, Drawer, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { useLocalStorage } from '@mantine/hooks';
import { IconMenu2 } from '@tabler/icons-react';
import { IMAGE_BASE_URL } from '../../utils/imageUrl';


const navItems = [
  { label: 'Hem', href: '#hem' },
  { label: 'Om', href: '#om' },
  { label: 'Nyhetsbrev', href: '#nyhetsbrev' },
  { label: 'Boka', href: '#boka' },
  { label: 'Spelningar', href: '#spelningar' },
  { label: 'Bandet', href: '#bandet' },
  { label: 'Rösta', href: '#rösta' },
  { label: 'Musik', href: '#musik' },
];


export function PublicLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [colorScheme, setColorScheme] = useLocalStorage<'light' | 'dark'>({
    key: 'color-scheme',
    defaultValue: 'dark',
  });

  const isAdmin = user?.roles.includes('Admin') ?? false;
  const isEditor = user?.roles.includes('Editor') ?? false;
  const isMember = user?.roles.includes('Member') ?? false;

const scrollTo = (href: string) => {
  setDrawerOpen(false);
  const id = href.replace('#', '');

  if (window.location.pathname !== '/') {
    navigate('/' + href);
    return;
  }

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
              SKAV
            </span>

            {/* Desktop nav */}
            <Group gap="xs" visibleFrom="sm">
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
              <Button
                variant="light"
                size="sm"
                onClick={() => navigate('/shop')}
              >
                Shop
              </Button>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
              >
                {colorScheme === 'dark' ? '☀️' : '🌙'}
              </ActionIcon>

              {isAuthenticated && (isAdmin || isEditor) && (
                <Button variant="light" size="sm" onClick={() => navigate('/admin')}>
                  Admin
                </Button>
              )}
            </Group>

            {/* Mobil hamburger */}
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              hiddenFrom="sm"
              onClick={() => setDrawerOpen(true)}
            >
              <IconMenu2 size={24} />
            </ActionIcon>
          </Group>
        </Container>
      </header>

      {/* Mobil drawer */}
      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="SKAV"
        size="xs"
        position="right"
      >
        <Stack gap="xs">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="subtle"
              color="gray"
              fullWidth
              justify="flex-start"
              onClick={() => scrollTo(item.href)}
            >
              {item.label}
            </Button>
          ))}
          <Button
            variant="light"
            fullWidth
            onClick={() => {
              navigate('/shop');
              setDrawerOpen(false);
            }}
          >
            Shop
          </Button>
          <Button
            variant="subtle"
            color="gray"
            fullWidth
            justify="flex-start"
            onClick={() => {
              setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
              setDrawerOpen(false);
            }}
          >
            {colorScheme === 'dark' ? '☀️ Ljust läge' : '🌙 Mörkt läge'}
          </Button>

          {isAuthenticated && (isAdmin || isEditor || isMember) && (
            <Button
              variant="light"
              fullWidth
              onClick={() => {
                navigate('/admin');
                setDrawerOpen(false);
              }}
            >
              Admin
            </Button>
          )}
        </Stack>
      </Drawer>

      <main style={{ paddingTop: 60, cursor: `url(${IMAGE_BASE_URL}/images/misc/liten-gralle.png), auto` }}>
        {children}
      </main>
    </>
  );
}