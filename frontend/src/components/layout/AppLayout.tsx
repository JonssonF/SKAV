import { AppShell, NavLink, Title, Group, Divider } from '@mantine/core';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';

const publicItems = [
  { label: 'Hem', path: '/' },
  { label: 'Album', path: '/albums' },
];

const adminItems = [
  { label: 'Dashboard', path: '/admin' },
];

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 200, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Title order={3}>SKAV</Title>
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

        {isAuthenticated && (
          <>
            <Divider my="sm" label="Admin" />
            {adminItems.map((item) => (
              <NavLink
                key={item.path}
                label={item.label}
                active={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              />
            ))}
          </>
        )}

        {!isAuthenticated && (
          <>
            <Divider my="sm" />
            <NavLink
              label="Logga in"
              active={location.pathname === '/login'}
              onClick={() => navigate('/login')}
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