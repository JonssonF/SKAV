import { useState } from 'react';
import { Modal, TextInput, Button, Stack, Text, Alert } from '@mantine/core';
import { useUnsubscribe } from '../hooks/useSubscribers';
import { getApiMessage } from '../../../utils/getApiErrors';

interface UnsubscribeModalProps {
  opened: boolean;
  onClose: () => void;
}

export function UnsubscribeModal({ opened, onClose }: UnsubscribeModalProps) {
  const unsubscribe = useUnsubscribe();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError(null);
    unsubscribe.mutate({ email: email.trim() }, {
      onSuccess: () => {
        setDone(true);
      },
      onError: (err) => {
        setError(getApiMessage(err));
      },
    });
  };

  const handleClose = () => {
    setEmail('');
    setDone(false);
    setError(null);
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Avregistrera nyhetsbrev" size="sm">
      {done ? (
        <Alert color="green" title="Klart!">
          Du har avregistrerats från nyhetsbrevet.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Text size="sm" c="dimmed">
              Ange din e-postadress för att avsluta prenumerationen.
            </Text>

            {error && <Alert color="red">{error}</Alert>}

            <TextInput
              placeholder="din@email.se"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
            />

            <Button type="submit" color="red" loading={unsubscribe.isPending}>
              Avregistrera
            </Button>
          </Stack>
        </form>
      )}
    </Modal>
  );
}