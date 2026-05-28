import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Switch,
  Textarea,
  Button,
  Card,
  Stack,
  Group,
  Loader,
  Alert,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useSiteSettings, useUpdateSiteSetting } from '../../features/shop/hooks/useSiteSettings';
import { getApiMessage } from '../../utils/getApiErrors';

const DEFAULT_MESSAGE = 'Vi tar inte emot beställningar just nu – prenumerera på vårt nyhetsbrev så meddelar vi när shopen öppnar igen!';

export function AdminShopSettingsPage() {
  const { data: settings, isLoading, error } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();

  const [paused, setPaused] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [hasChanges, setHasChanges] = useState(false);

  // Hämta nuvarande värden från backend
  const currentPaused = settings?.find((s) => s.key === 'ShopPaused')?.value === 'true';
  const currentMessage = settings?.find((s) => s.key === 'ShopPausedMessage')?.value ?? DEFAULT_MESSAGE;
  const lastUpdated = settings?.find((s) => s.key === 'ShopPaused');

  useEffect(() => {
    if (settings) {
      setPaused(currentPaused);
      setMessage(currentMessage);
      setHasChanges(false);
    }
  }, [settings]);

  const handlePausedChange = (checked: boolean) => {
    setPaused(checked);
    setHasChanges(true);
  };

  const handleMessageChange = (value: string) => {
    setMessage(value);
    setHasChanges(true);
  };

  const handleResetMessage = () => {
    setMessage(DEFAULT_MESSAGE);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await updateSetting.mutateAsync({ key: 'ShopPaused', value: paused.toString() });
      await updateSetting.mutateAsync({ key: 'ShopPausedMessage', value: message });
      setHasChanges(false);
      notifications.show({
        title: paused ? 'Webshopen pausad' : 'Webshopen öppen',
        message: paused ? 'Besökare kan bläddra men inte beställa.' : 'Besökare kan nu beställa igen.',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'Något gick fel',
        message: getApiMessage(err),
        color: 'red',
      });
    }
  };

  if (isLoading) {
    return (
      <Container py="xl">
        <Group justify="center"><Loader size="lg" /></Group>
      </Container>
    );
  }

  if (error) {
    return (
      <Container py="xl">
        <Alert color="red" title="Något gick fel">
          Kunde inte hämta inställningar.
        </Alert>
      </Container>
    );
  }

  return (
    <Container py="xl">
      <Title order={1} mb="xs">Webshop-inställningar</Title>
      <Text c="dimmed" mb="lg">
        Styr om webshopen tar emot beställningar. Besökare kan alltid bläddra bland produkter.
      </Text>

      <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
        <Stack gap="lg">
          <Group justify="space-between">
            <div>
              <Text fw={700} size="lg">
                {paused ? 'Webshopen är pausad' : 'Webshopen är öppen'}
              </Text>
              <Text size="sm" c="dimmed">
                {paused
                  ? 'Besökare kan bläddra men inte lägga beställningar.'
                  : 'Besökare kan bläddra och lägga beställningar.'}
              </Text>
            </div>
            <Switch
              checked={paused}
              onChange={(e) => handlePausedChange(e.currentTarget.checked)}
              size="lg"
              color="red"
              label={paused ? 'Pausad' : 'Öppen'}
            />
          </Group>

          <Textarea
            label="Meddelande till besökare"
            description="Visas på webshopen när den är pausad."
            value={message}
            onChange={(e) => handleMessageChange(e.currentTarget.value)}
            minRows={3}
            disabled={!paused}
          />

          <Group justify="space-between">
            <Button
              variant="subtle"
              size="xs"
              onClick={handleResetMessage}
              disabled={!paused || message === DEFAULT_MESSAGE}
            >
              Återställ standardmeddelande
            </Button>
            <Button
              onClick={handleSave}
              loading={updateSetting.isPending}
              disabled={!hasChanges}
            >
              Spara
            </Button>
          </Group>
        </Stack>
      </Card>

      {lastUpdated?.updatedAt && (
        <Text size="xs" c="dimmed" ta="right">
          Senast ändrad av {lastUpdated.updatedByEmail ?? 'okänd'}{' '}
          {new Date(lastUpdated.updatedAt).toLocaleDateString('sv-SE', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      )}
    </Container>
  );
}