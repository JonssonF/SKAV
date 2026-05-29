import { useState } from 'react';
import { Container, Text, Card, Alert, Stack, Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconMailFast } from '@tabler/icons-react';
import { BookingForm } from './BookingForm';
import { useCreateBookingRequest } from '../hooks/useBookingRequests';
import { useSiteSettings } from '../../shop/hooks/useSiteSettings';
import { getApiErrors, getApiMessage } from '../../../utils/getApiErrors';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import type { CreateBookingRequest } from '../../../types/bookingRequest.types';

export function BookingSection() {
  const createBooking = useCreateBookingRequest();
  const { data: settings } = useSiteSettings();
  const [formErrors, setFormErrors] = useState<Record<string, string> | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const bookingPaused = settings?.find((s) => s.key === 'BookingPaused')?.value === 'true';
  const bookingPausedMessage = settings?.find((s) => s.key === 'BookingPausedMessage')?.value;

  const handleSubmit = (data: CreateBookingRequest) => {
    setFormErrors(null);
    createBooking.mutate(data, {
      onSuccess: () => {
        setSubmitted(true);
        notifications.show({
          title: 'Förfrågan skickad!',
          message: 'Vi återkommer så snart vi kan.',
          color: 'green',
        });
      },
      onError: (err) => {
        const fieldErrors = getApiErrors(err);
        if (fieldErrors) {
          setFormErrors(fieldErrors);
        } else {
          notifications.show({
            title: 'Något gick fel',
            message: getApiMessage(err),
            color: 'red',
          });
        }
      },
    });
  };

  return (
    <Container size="sm" py="xl">
      <SectionTitle text="Boka oss" />
      <Text ta="center" c="dimmed" mb="xl" style={{ whiteSpace: 'pre-line' }}>
        {'Vill ni ha livemusik på ert event?\nSkicka en förfrågan så hör vi av oss!'}
      </Text>

      {bookingPaused ? (
        <Card shadow="sm" padding="lg" radius="md" withBorder bg="var(--mantine-color-yellow-light)">
          <Stack gap="sm" align="center">
            <Text ta="center" fw={600} size="lg">
              {bookingPausedMessage || 'Vi tar inte emot bokningar just nu.'}
            </Text>
            <Button
              component="a"
              href="/#nyhetsbrev"
              variant="light"
              leftSection={<IconMailFast size={18} />}
            >
              Prenumerera på nyhetsbrevet
            </Button>
          </Stack>
        </Card>
      ) : submitted ? (
        <Alert color="green" title="Tack för din förfrågan!">
          Vi har tagit emot din bokningsförfrågan och återkommer så snart vi kan.
        </Alert>
      ) : (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <BookingForm
            onSubmit={handleSubmit}
            loading={createBooking.isPending}
            errors={formErrors}
          />
        </Card>
      )}
    </Container>
  );
}