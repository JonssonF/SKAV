import { useState } from 'react';
import {
  Container,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Alert,
  Stack,
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
      navigate('/admin');
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
    <Container size={420} py={80}>
      <Title ta="center" mb="lg">
        Logga in
      </Title>

      <Paper withBorder shadow="md" p="xl" radius="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            {error && (
              <Alert color="red" variant="light">
                {error}
              </Alert>
            )}

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

            <Button type="submit" fullWidth loading={loading}>
              Logga in
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}