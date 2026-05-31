import { useState } from 'react';
import {
  Container,
  Title,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Badge,
  Alert,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useSendNewsletter, usePreviewNewsletter } from '../../features/newsletter/hooks/useNewsletter';
import { useSubscribers } from '../../features/subscribers/hooks/useSubscribers';
import { getApiMessage } from '../../utils/getApiErrors';

export function AdminNewsletterPage() {
  const { data: subscribers } = useSubscribers();
  const sendNewsletter = useSendNewsletter();
  const previewNewsletter = usePreviewNewsletter();

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  const activeCount = subscribers?.length ?? 0;

  const handlePreview = () => {
    if (previewHtml) {
      setPreviewHtml(null);
      return;
    }

    previewNewsletter.mutate(
      { subject: subject.trim(), body: body.trim() },
      {
        onSuccess: (result) => setPreviewHtml(result.html),
        onError: (err) => {
          notifications.show({
            title: 'Kunde inte generera förhandsgranskning',
            message: getApiMessage(err),
            color: 'red',
          });
        },
      }
    );
  };

  const handleSend = () => {
    if (!subject.trim() || !body.trim()) return;
    if (!window.confirm(`Skicka nyhetsbrevet till ${activeCount} prenumeranter?`)) return;

    sendNewsletter.mutate(
      { subject: subject.trim(), body: body.trim() },
      {
        onSuccess: (result) => {
          setSubject('');
          setBody('');
          setPreviewHtml(null);
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
            onClick={handlePreview}
            loading={previewNewsletter.isPending}
            disabled={!subject.trim() && !body.trim()}
          >
            {previewHtml ? 'Dölj förhandsgranskning' : 'Förhandsgranska'}
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

      {previewHtml && (
        <>
          <Title order={2} mb="md">Förhandsgranskning</Title>
          <iframe
            srcDoc={previewHtml}
            style={{
              width: '100%',
              height: 700,
              border: '1px solid var(--mantine-color-default-border)',
              borderRadius: 'var(--mantine-radius-md)',
            }}
            title="Förhandsgranskning av nyhetsbrev"
          />
        </>
      )}
    </Container>
  );
}