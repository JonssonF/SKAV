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
  Divider,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useSiteSettings, useUpdateSiteSetting } from '../../features/shop/hooks/useSiteSettings';
import { getApiMessage } from '../../utils/getApiErrors';

const DEFAULT_SHOP_MESSAGE = 'Vi tar inte emot beställningar just nu – prenumerera på vårt nyhetsbrev så meddelar vi när shopen öppnar igen!';
const DEFAULT_BOOKING_MESSAGE = 'Vi tar inte emot bokningar just nu – prenumerera på vårt nyhetsbrev så meddelar vi när vi öppnar igen!';

export function AdminSiteSettingsPage() {
  const { data: settings, isLoading, error } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();

  // Shop state
  const [shopPaused, setShopPaused] = useState(false);
  const [shopMessage, setShopMessage] = useState(DEFAULT_SHOP_MESSAGE);
  const [shopHasChanges, setShopHasChanges] = useState(false);

  // Booking state
  const [bookingPaused, setBookingPaused] = useState(false);
  const [bookingMessage, setBookingMessage] = useState(DEFAULT_BOOKING_MESSAGE);
  const [bookingHasChanges, setBookingHasChanges] = useState(false);

  // Audit info
  const shopUpdated = settings?.find((s) => s.key === 'ShopPaused');
  const bookingUpdated = settings?.find((s) => s.key === 'BookingPaused');

  useEffect(() => {
    if (settings) {
      setShopPaused(settings.find((s) => s.key === 'ShopPaused')?.value === 'true');
      setShopMessage(settings.find((s) => s.key === 'ShopPausedMessage')?.value ?? DEFAULT_SHOP_MESSAGE);
      setShopHasChanges(false);

      setBookingPaused(settings.find((s) => s.key === 'BookingPaused')?.value === 'true');
      setBookingMessage(settings.find((s) => s.key === 'BookingPausedMessage')?.value ?? DEFAULT_BOOKING_MESSAGE);
      setBookingHasChanges(false);
    }
  }, [settings]);

  const handleSaveShop = async () => {
    try {
      await updateSetting.mutateAsync({ key: 'ShopPaused', value: shopPaused.toString() });
      await updateSetting.mutateAsync({ key: 'ShopPausedMessage', value: shopMessage });
      setShopHasChanges(false);
      notifications.show({
        title: shopPaused ? 'Webshopen pausad' : 'Webshopen öppen',
        message: shopPaused ? 'Besökare kan bläddra men inte beställa.' : 'Besökare kan nu beställa igen.',
        color: 'green',
      });
    } catch (err) {
      notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
    }
  };

  const handleSaveBooking = async () => {
    try {
      await updateSetting.mutateAsync({ key: 'BookingPaused', value: bookingPaused.toString() });
      await updateSetting.mutateAsync({ key: 'BookingPausedMessage', value: bookingMessage });
      setBookingHasChanges(false);
      notifications.show({
        title: bookingPaused ? 'Bokningar pausade' : 'Bokningar öppna',
        message: bookingPaused ? 'Besökare kan inte skicka bokningsförfrågningar.' : 'Besökare kan nu skicka bokningsförfrågningar igen.',
        color: 'green',
      });
    } catch (err) {
      notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
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
      <Title order={1} mb="xs">Inställningar</Title>
      <Text c="dimmed" mb="lg">
        Hantera webshop och bokningar. Besökare kan alltid bläddra – dessa inställningar styr om de kan beställa eller boka.
      </Text>

      {/* ── Webshop ──────────────────────────────────── */}
      <Title order={2} mb="md">Webshop</Title>
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Stack gap="lg">
          <Group justify="space-between">
            <div>
              <Text fw={700} size="lg">
                {shopPaused ? 'Webshopen är pausad' : 'Webshopen är öppen'}
              </Text>
              <Text size="sm" c="dimmed">
                {shopPaused
                  ? 'Besökare kan bläddra men inte lägga beställningar.'
                  : 'Besökare kan bläddra och lägga beställningar.'}
              </Text>
            </div>
            <Switch
              checked={shopPaused}
              onChange={(e) => { setShopPaused(e.currentTarget.checked); setShopHasChanges(true); }}
              size="lg"
              color="red"
              label={shopPaused ? 'Pausad' : 'Öppen'}
            />
          </Group>

          <Textarea
            label="Meddelande till besökare"
            description="Visas på webshopen när den är pausad."
            value={shopMessage}
            onChange={(e) => { setShopMessage(e.currentTarget.value); setShopHasChanges(true); }}
            minRows={3}
            disabled={!shopPaused}
          />

          <Group justify="space-between">
            <Button
              variant="subtle"
              size="xs"
              onClick={() => { setShopMessage(DEFAULT_SHOP_MESSAGE); setShopHasChanges(true); }}
              disabled={!shopPaused || shopMessage === DEFAULT_SHOP_MESSAGE}
            >
              Återställ standardmeddelande
            </Button>
            <Button
              onClick={handleSaveShop}
              loading={updateSetting.isPending}
              disabled={!shopHasChanges}
            >
              Spara
            </Button>
          </Group>
        </Stack>
      </Card>

      {shopUpdated?.updatedAt && (
        <Text size="xs" c="dimmed" ta="right" mb="xl">
          Senast ändrad av {shopUpdated.updatedByEmail ?? 'okänd'}{' '}
          {new Date(shopUpdated.updatedAt).toLocaleDateString('sv-SE', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      )}

      <Divider my="xl" />

      {/* ── Bokningar ────────────────────────────────── */}
      <Title order={2} mb="md">Bokningar</Title>
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Stack gap="lg">
          <Group justify="space-between">
            <div>
              <Text fw={700} size="lg">
                {bookingPaused ? 'Bokningar är pausade' : 'Bokningar är öppna'}
              </Text>
              <Text size="sm" c="dimmed">
                {bookingPaused
                  ? 'Besökare kan inte skicka bokningsförfrågningar.'
                  : 'Besökare kan skicka bokningsförfrågningar.'}
              </Text>
            </div>
            <Switch
              checked={bookingPaused}
              onChange={(e) => { setBookingPaused(e.currentTarget.checked); setBookingHasChanges(true); }}
              size="lg"
              color="red"
              label={bookingPaused ? 'Pausad' : 'Öppen'}
            />
          </Group>

          <Textarea
            label="Meddelande till besökare"
            description="Visas istället för bokningsformuläret när bokningar är pausade."
            value={bookingMessage}
            onChange={(e) => { setBookingMessage(e.currentTarget.value); setBookingHasChanges(true); }}
            minRows={3}
            disabled={!bookingPaused}
          />

          <Group justify="space-between">
            <Button
              variant="subtle"
              size="xs"
              onClick={() => { setBookingMessage(DEFAULT_BOOKING_MESSAGE); setBookingHasChanges(true); }}
              disabled={!bookingPaused || bookingMessage === DEFAULT_BOOKING_MESSAGE}
            >
              Återställ standardmeddelande
            </Button>
            <Button
              onClick={handleSaveBooking}
              loading={updateSetting.isPending}
              disabled={!bookingHasChanges}
            >
              Spara
            </Button>
          </Group>
        </Stack>
      </Card>

      {bookingUpdated?.updatedAt && (
        <Text size="xs" c="dimmed" ta="right">
          Senast ändrad av {bookingUpdated.updatedByEmail ?? 'okänd'}{' '}
          {new Date(bookingUpdated.updatedAt).toLocaleDateString('sv-SE', {
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