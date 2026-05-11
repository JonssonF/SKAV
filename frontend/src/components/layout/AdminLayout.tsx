import { AppShell, NavLink, Title, Group, Button, ActionIcon } from '@mantine/core';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { useLocalStorage } from '@mantine/hooks';

const adminItems = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Användare', path: '/admin/users' },
  { label: 'Medlemmar', path: '/admin/members' },
  { label: 'Spelningar', path: '/admin/gigs' },
  { label: 'Album', path: '/admin/albums' },
  { label: 'Låtar', path: '/admin/songs' },
  { label: 'Nyhetsbrev', path: '/admin/newsletter' },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [colorScheme, setColorScheme] = useLocalStorage<'light' | 'dark'>({
    key: 'color-scheme',
    defaultValue: 'dark',
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 200, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title
            order={3}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            SKAV
          </Title>
          <Group gap="sm">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
            >
              {colorScheme === 'dark' ? '☀️' : '🌙'}
            </ActionIcon>
            <Button variant="subtle" size="xs" color="gray" onClick={() => navigate('/')}>
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
            onClick={() => navigate(item.path)}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}