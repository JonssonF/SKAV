import { AppShell, NavLink, Title, Group, Divider, Button } from '@mantine/core';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';

const publicItems = [
  { label: 'Hem', path: '/' },
  { label: 'Spelningar', path: '/gigs' },
  { label: 'Bandet', path: '/members' },
  { label: 'Album', path: '/albums' },
];

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const isAdmin = user?.roles.includes('Admin') ?? false;
  const isEditor = user?.roles.includes('Editor') ?? false;
  const isMember = user?.roles.includes('Member') ?? false;

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
          <Title order={3}>SKAV</Title>
          {isAuthenticated && (
            <Group gap="sm">
              <Button variant="subtle" size="xs" color="gray" onClick={handleLogout}>
                Logga ut
              </Button>
            </Group>
          )}
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        {publicItems.map((item) => (
          <NavLink
            key={item.path}
            label={item.label}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}

        {isAuthenticated && (isAdmin || isEditor) && (
          <>
            <Divider my="sm" label="Hantera" />
            <NavLink
              label="Dashboard"
              active={location.pathname === '/admin'}
              onClick={() => navigate('/admin')}
            />
          </>
        )}

        {isAuthenticated && isMember && !isAdmin && !isEditor && (
          <>
            <Divider my="sm" label="Min profil" />
            <NavLink
              label="Mitt kort"
              active={location.pathname === '/admin/profile'}
              onClick={() => navigate('/admin/profile')}
            />
          </>
        )}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}