import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Center,
  Paper,
  Title,
  PasswordInput,
  Button,
  Alert,
  Stack,
} from '@mantine/core';
import { authApi } from '../api/auth.api';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Lösenordet måste vara minst 6 tecken.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte.');
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword({ token, newPassword: password });
      setDone(true);
    } catch {
      setError('Ogiltig eller utgången länk. Begär en ny.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Center h="60vh">
        <Paper withBorder shadow="md" p="xl" radius="md" w={400}>
          <Alert color="red">Ingen token angiven.</Alert>
        </Paper>
      </Center>
    );
  }

  return (
    <Center h="60vh">
      <Paper withBorder shadow="md" p="xl" radius="md" w={400}>
        <Stack gap="md">
          <Title ta="center" order={2}>Nytt lösenord</Title>

          {done ? (
            <>
              <Alert color="green" title="Lösenordet har ändrats!">
                Du kan nu logga in med ditt nya lösenord.
              </Alert>
              <Button fullWidth onClick={() => navigate('/login')}>
                Gå till login
              </Button>
            </>
          ) : (
            <>
              {error && (
                <Alert color="red" variant="light">{error}</Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Stack gap="md">
                  <PasswordInput
                    label="Nytt lösenord"
                    placeholder="Minst 6 tecken"
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    required
                  />
                  <PasswordInput
                    label="Bekräfta lösenord"
                    placeholder="Upprepa lösenordet"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                    required
                  />
                  <Button type="submit" fullWidth loading={loading}>
                    Spara nytt lösenord
                  </Button>
                </Stack>
              </form>
            </>
          )}
        </Stack>
      </Paper>
    </Center>
  );
}