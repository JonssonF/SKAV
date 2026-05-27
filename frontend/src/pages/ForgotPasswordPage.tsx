import { useState } from 'react';
import {
  Center,
  Paper,
  Title,
  TextInput,
  Button,
  Alert,
  Stack,
  Text,
  Anchor,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError('');
    setLoading(true);

    try {
      await authApi.forgotPassword({ email: email.trim() });
      setSent(true);
    } catch {
      setError('Något gick fel. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center h="60vh">
      <Paper withBorder shadow="md" p="xl" radius="md" w={400}>
        <Stack gap="md">
          <Title ta="center" order={2}>Glömt lösenord</Title>

          {sent ? (
            <>
              <Alert color="green" title="Kolla din inkorg!">
                Om e-postadressen finns i systemet har vi skickat en återställningslänk.
              </Alert>
              <Anchor
                size="sm"
                ta="center"
                onClick={() => navigate('/login')}
                style={{ cursor: 'pointer' }}
              >
                Tillbaka till login
              </Anchor>
            </>
          ) : (
            <>
              <Text size="sm" c="dimmed" ta="center">
                Ange din e-postadress så skickar vi en länk för att återställa ditt lösenord.
              </Text>

              {error && (
                <Alert color="red" variant="light">{error}</Alert>
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
                  <Button type="submit" fullWidth loading={loading}>
                    Skicka återställningslänk
                  </Button>
                  <Anchor
                    size="sm"
                    ta="center"
                    onClick={() => navigate('/login')}
                    style={{ cursor: 'pointer' }}
                  >
                    Tillbaka till login
                  </Anchor>
                </Stack>
              </form>
            </>
          )}
        </Stack>
      </Paper>
    </Center>
  );
}