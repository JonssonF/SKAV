import { AppShell, NavLink, Title, Group } from '@mantine/core';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

const navItems = [
  { label: 'Hem', path: '/' },
  { label: 'Album', path: '/albums' },
];

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

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
        {navItems.map((item) => (
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