import { Container, Title, Text, Button, Group } from '@mantine/core';
import { useAuth } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

export function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container py="xl">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={1}>Admin</Title>
          <Text c="dimmed">Inloggad som {user?.email}</Text>
        </div>
        <Button variant="light" color="red" onClick={handleLogout}>
          Logga ut
        </Button>
      </Group>
      <Text>Här kommer admin-panelen att byggas ut.</Text>
    </Container>
  );
}