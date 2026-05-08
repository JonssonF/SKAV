import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Card,
  Badge,
  Alert,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useSendNewsletter } from '../../features/newsletter/hooks/useNewsletter';
import { useSubscribers } from '../../features/subscribers/hooks/useSubscribers';
import { getApiMessage } from '../../utils/getApiErrors';

export function AdminNewsletterPage() {
  const { data: subscribers } = useSubscribers();
  const sendNewsletter = useSendNewsletter();

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [preview, setPreview] = useState(false);

  const activeCount = subscribers?.length ?? 0;

  const handleSend = () => {
    if (!subject.trim() || !body.trim()) return;

    if (!window.confirm(`Skicka nyhetsbrevet till ${activeCount} prenumeranter?`)) return;

    sendNewsletter.mutate(
        { subject: subject.trim(), body: body.trim() },
        {
        onSuccess: (result) => {
            setSubject('');
            setBody('');
            setPreview(false);
            notifications.show({
            title: 'Nyhetsbrev skickat!',
            message: `${result.sent} av ${result.totalSubscribers} skickade.${result.failed > 0 ? ` ${result.failed} misslyckades.` : ''}`,
            color: result.failed > 0 ? 'yellow' : 'green',
            });
        },
        onError: (err) => {
            notifications.show({
            title: 'Något gick fel',
            message: getApiMessage(err),
            color: 'red',
            });
        },
        }
    );
    };

  return (
    <Container py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Nyhetsbrev</Title>
        <Badge size="lg" variant="light">
          {activeCount} prenumeranter
        </Badge>
      </Group>

      {activeCount === 0 && (
        <Alert color="yellow" mb="lg">
          Det finns inga aktiva prenumeranter att skicka till.
        </Alert>
      )}

      <Stack gap="md" mb="xl">
        <TextInput
          label="Ämne"
          placeholder="T.ex. Ny spelning inbokad!"
          value={subject}
          onChange={(e) => setSubject(e.currentTarget.value)}
          required
        />

        <Textarea
          label="Innehåll"
          placeholder="Skriv nyhetsbrevet här..."
          value={body}
          onChange={(e) => setBody(e.currentTarget.value)}
          minRows={10}
          autosize
          required
        />

        <Group justify="flex-end" gap="sm">
          <Button
            variant="subtle"
            onClick={() => setPreview(!preview)}
            disabled={!subject.trim() && !body.trim()}
          >
            {preview ? 'Dölj förhandsgranskning' : 'Förhandsgranska'}
          </Button>
          <Button
            onClick={handleSend}
            loading={sendNewsletter.isPending}
            disabled={!subject.trim() || !body.trim() || activeCount === 0}
          >
            Skicka nyhetsbrev
          </Button>
        </Group>
      </Stack>

      {preview && (subject.trim() || body.trim()) && (
        <>
          <Title order={2} mb="md">Förhandsgranskning</Title>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">{subject || '(Inget ämne)'}</Title>
            <Text style={{ whiteSpace: 'pre-line' }}>
              {body || '(Inget innehåll)'}
            </Text>
          </Card>
        </>
      )}
    </Container>
  );
}