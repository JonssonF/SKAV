import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Text, Button, Stack, Alert, Paper } from '@mantine/core';
import { useUnsubscribe } from '../features/subscribers/hooks/useSubscribers';
import { getApiMessage } from '../utils/getApiErrors';

export function UnsubscribePage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const unsubscribe = useUnsubscribe();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUnsubscribe = () => {
    if (!email) return;

    setError(null);
    unsubscribe.mutate({ email }, {
      onSuccess: () => setDone(true),
      onError: (err) => setError(getApiMessage(err)),
    });
  };

  return (
    <Container size="xs" py={80}>
      <Paper shadow="sm" radius="md" p="xl" withBorder>
        <Stack gap="md" align="center">
          <Text size="xl" fw={700}>SKAV</Text>

          {!email ? (
            <Alert color="red">Ingen e-postadress angiven.</Alert>
          ) : done ? (
            <Alert color="green" title="Klart!">
              {email} har avregistrerats från nyhetsbrevet.
            </Alert>
          ) : (
            <>
              <Text ta="center" c="dimmed">
                Vill du avsluta din prenumeration på SKAVs nyhetsbrev?
              </Text>
              <Text ta="center" fw={500}>{email}</Text>
              {error && <Alert color="red">{error}</Alert>}
              <Button
                color="red"
                onClick={handleUnsubscribe}
                loading={unsubscribe.isPending}
              >
                Ja, avregistrera mig
              </Button>
            </>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}