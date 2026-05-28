import { AppShell, NavLink, Title, Group, Button, ActionIcon, Burger } from '@mantine/core';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { useLocalStorage, useDisclosure } from '@mantine/hooks';
import { IconShoppingCart } from '@tabler/icons-react';

const adminItems = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Användare', path: '/admin/users' },
  { label: 'Medlemmar', path: '/admin/members' },
  { label: 'Spelningar', path: '/admin/gigs' },
  { label: 'Låtar', path: '/admin/songs' },
  { label: 'Låtförslag', path: '/admin/song-proposals' },
  { label: 'Nyhetsbrev', path: '/admin/newsletter' },
  { label: 'Produkter', path: '/admin/products' },
  { label: 'Webshop', path: '/admin/shop-settings', icon: IconShoppingCart }
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [opened, { toggle, close }] = useDisclosure();
  const [colorScheme, setColorScheme] = useLocalStorage<'light' | 'dark'>({
    key: 'color-scheme',
    defaultValue: 'dark',
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    close();
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title
              order={3}
              style={{ cursor: 'pointer' }}
              onClick={() => handleNavigate('/')}
            >
              SKAV
            </Title>
          </Group>
          <Group gap="sm">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
            >
              {colorScheme === 'dark' ? '☀️' : '🌙'}
            </ActionIcon>
            <Button variant="subtle" size="xs" color="gray" onClick={() => handleNavigate('/')} visibleFrom="sm">
              Till hemsidan
            </Button>
            <Button variant="subtle" size="xs" color="gray" onClick={handleLogout}>
              Logga ut
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        {adminItems.map((item) => (
          <NavLink
            key={item.path}
            label={item.label}
            active={location.pathname === item.path}
            onClick={() => handleNavigate(item.path)}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}