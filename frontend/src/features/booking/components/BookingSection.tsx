import { useState } from 'react';
import { Container, Title, Text, Card, Alert } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { BookingForm } from './BookingForm';
import { useCreateBookingRequest } from '../hooks/useBookingRequests';
import { getApiErrors, getApiMessage } from '../../../utils/getApiErrors';
import type { CreateBookingRequest } from '../../../types/bookingRequest.types';

export function BookingSection() {
  const createBooking = useCreateBookingRequest();
  const [formErrors, setFormErrors] = useState<Record<string, string> | null>(null);
  const [submitted, setSubmitted] = useState(false);

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
      <Title order={2} mb="lg" ta="center">Boka oss</Title>
      <Text ta="center" c="dimmed" mb="xl">
        Vill ni ha livemusik på ert event? Skicka en förfrågan så hör vi av oss!
      </Text>

      {submitted ? (
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