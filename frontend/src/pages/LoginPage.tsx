import { useState } from 'react';
import {
  Center,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Alert,
  Stack,
  Anchor,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { authApi } from '../api/auth.api';
import type { ApiError } from '../types/api-error.types';
import { AxiosError } from 'axios';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      login(response.token);
      navigate('/');
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data) {
        const apiError = err.response.data as ApiError;
        setError(apiError.message || 'Inloggning misslyckades');
      } else {
        setError('Något gick fel. Är backend igång?');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center h="60vh">
      <Paper withBorder shadow="md" p="xl" radius="md" w={400}>
        <Stack gap="md">
          <Title ta="center" order={2}>SKAV</Title>

          {error && (
            <Alert color="red" variant="light">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="E-post"
                placeholder="din@email.se"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
              />

              <PasswordInput
                label="Lösenord"
                placeholder="Ditt lösenord"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
              />

              <Anchor
                size="sm"
                ta="right"
                onClick={() => navigate('/forgot-password')}
                style={{ cursor: 'pointer' }}
              >
                Glömt lösenord?
              </Anchor>

              <Button type="submit" fullWidth loading={loading}>
                Logga in
              </Button>
              <Button variant="subtle" color="lightgray" onClick={() => navigate('/')}>
                Tillbaka till SKAV
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Center>
  );
}