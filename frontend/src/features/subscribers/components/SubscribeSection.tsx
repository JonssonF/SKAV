import { useState } from 'react';
import { Container, Title, Text, TextInput, Button, Group, Alert } from '@mantine/core';
import { useSubscribe } from '../hooks/useSubscribers';
import { getApiMessage } from '../../../utils/getApiErrors';
import { SectionTitle } from '../../../components/ui/SectionTitle';

export function SubscribeSection() {
  const subscribe = useSubscribe();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError(null);
    subscribe.mutate({ email: email.trim() }, {
      onSuccess: () => {
        setSubmitted(true);
      },
      onError: (err) => {
        setError(getApiMessage(err));
      },
    });
  };

  return (
    <Container size="sm" py="xl">
      <SectionTitle text="Nyhetsbrev" />
      <Text ta="center" c="dimmed" mb="lg">
        Missa aldrig något ifrån SKAV! <br/>Få nyheter om spelningar och släpp direkt i din inkorg.
      </Text>

      {submitted ? (
        <Alert color="green" title="Tack!">
          Du är nu registrerad för vårt nyhetsbrev.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert color="red" mb="md">{error}</Alert>
          )}
          <Group justify="center" gap="sm">
            <TextInput
              placeholder="din@email.se"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              style={{ flex: 1, maxWidth: 300 }}
              required
            />
            <Button type="submit" loading={subscribe.isPending}>
              Prenumerera
            </Button>
          </Group>
        </form>
      )}
    </Container>
  );
}