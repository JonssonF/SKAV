import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Badge,
  Stack,
  Loader,
  Alert,
  Table,
  Collapse,
  Button,
  TextInput,
  ActionIcon,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../providers/AuthProvider';
import { useBookingRequests, useMarkBookingRead } from '../../features/booking/hooks/useBookingRequests';
import { useBookingRecipients, useCreateBookingRecipient, useDeleteBookingRecipient } from '../../features/booking/hooks/useBookingRecipients';
import { getApiMessage } from '../../utils/getApiErrors';
import { IconTrash } from '@tabler/icons-react';
import { useSubscribers } from '../../features/subscribers/hooks/useSubscribers';

export function AdminDashboardPage() {
  const { user } = useAuth();
  const { data: bookings, isLoading, error } = useBookingRequests();
  const markAsRead = useMarkBookingRead();

  const { data: recipients, isLoading: recipientsLoading } = useBookingRecipients();
  const createRecipient = useCreateBookingRecipient();
  const deleteRecipient = useDeleteBookingRecipient();

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [newEmail, setNewEmail] = useState('');

  const unreadCount = bookings?.filter((b) => !b.isRead).length ?? 0;

  const { data: subscribers } = useSubscribers();
  const activeSubscribers = subscribers?.length ?? 0;

  const toggleExpanded = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAddRecipient = () => {
    if (!newEmail.trim()) return;
    createRecipient.mutate({ email: newEmail.trim() }, {
      onSuccess: () => {
        setNewEmail('');
        notifications.show({
          title: 'Mottagare tillagd',
          message: `${newEmail} får nu bokningsnotiser.`,
          color: 'green',
        });
      },
      onError: (err) => {
        notifications.show({
          title: 'Något gick fel',
          message: getApiMessage(err),
          color: 'red',
        });
      },
    });
  };

  const handleDeleteRecipient = (id: number, email: string) => {
    if (!window.confirm(`Ta bort ${email} från mottagarlistan?`)) return;
    deleteRecipient.mutate(id, {
      onSuccess: () => {
        notifications.show({
          title: 'Mottagare borttagen',
          message: `${email} får inte längre bokningsnotiser.`,
          color: 'green',
        });
      },
      onError: (err) => {
        notifications.show({
          title: 'Något gick fel',
          message: getApiMessage(err),
          color: 'red',
        });
      },
    });
  };

  return (
    <Container py="xl">
      <Title order={1} mb="xs">Dashboard</Title>
      <Text c="dimmed" mb="lg">Inloggad som {user?.email}</Text>
      {/* ── Statistik ──────────────────────────────────── */}
      <Group mb="xl" gap="md">
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flex: 1 }}>
          <Text size="sm" c="dimmed">Prenumeranter</Text>
          <Title order={2}>{activeSubscribers}</Title>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flex: 1 }}>
          <Text size="sm" c="dimmed">Bokningsförfrågningar</Text>
          <Title order={2}>{bookings?.length ?? 0}</Title>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flex: 1 }}>
          <Text size="sm" c="dimmed">Obesvarade</Text>
          <Title order={2} c={unreadCount > 0 ? 'red' : undefined}>{unreadCount}</Title>
        </Card>
      </Group>
      {/* ── Bokningsförfrågningar ────────────────────────── */}
      <Title order={2} mb="md">
        <Group gap="sm">
          Bokningsförfrågningar
          {unreadCount > 0 && (
            <Badge color="red" size="lg">{unreadCount} nya</Badge>
          )}
        </Group>
      </Title>

      {isLoading && (
        <Group justify="center" py="xl">
          <Loader size="lg" />
        </Group>
      )}

      {error && (
        <Alert color="red" title="Något gick fel" mb="md">
          Kunde inte hämta bokningsförfrågningar.
        </Alert>
      )}

      {!isLoading && !error && (!bookings || bookings.length === 0) && (
        <Text c="dimmed" mb="xl">Inga bokningsförfrågningar ännu.</Text>
      )}

      {bookings && bookings.length > 0 && (
        <Stack gap="xs" mb="xl">
          {bookings.map((booking) => (
            <Card
              key={booking.id}
              shadow="sm"
              padding="md"
              radius="md"
              withBorder
              style={{
                opacity: booking.isRead ? 0.7 : 1,
                borderLeft: booking.isRead ? undefined : '3px solid var(--mantine-color-blue-filled)',
                cursor: 'pointer',
              }}
              onClick={() => toggleExpanded(booking.id)}
            >
              {/* ── Kompakt rad ──────────────────────────── */}
              <Group justify="space-between">
                <Group gap="sm">
                  <Text fw={700}>{booking.name}</Text>
                  {booking.eventType && (
                    <Badge variant="light" color="gray" size="sm">{booking.eventType}</Badge>
                  )}
                  {!booking.isRead && (
                    <Badge color="blue" size="sm">Ny</Badge>
                  )}
                </Group>
                <Text size="sm" c="dimmed">
                  {new Date(booking.createdAt).toLocaleDateString('sv-SE', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </Group>

              <Collapse expanded={expandedId === booking.id}>
                <div style={{ paddingTop: 12 }} onClick={(e) => e.stopPropagation()}>
                  <Table withRowBorders={false} mb="sm">
                    <Table.Tbody>
                      <Table.Tr>
                        <Table.Td w={100}><Text size="sm" c="dimmed">E-post</Text></Table.Td>
                        <Table.Td><Text size="sm">{booking.email}</Text></Table.Td>
                      </Table.Tr>
                      {booking.phone && (
                        <Table.Tr>
                          <Table.Td><Text size="sm" c="dimmed">Telefon</Text></Table.Td>
                          <Table.Td><Text size="sm">{booking.phone}</Text></Table.Td>
                        </Table.Tr>
                      )}
                      {booking.eventDate && (
                        <Table.Tr>
                          <Table.Td><Text size="sm" c="dimmed">Datum</Text></Table.Td>
                          <Table.Td>
                            <Text size="sm">
                              {new Date(booking.eventDate).toLocaleDateString('sv-SE', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </Text>
                          </Table.Td>
                        </Table.Tr>
                      )}
                    </Table.Tbody>
                  </Table>

                  <Text size="sm" mb="md">{booking.message}</Text>
                    {booking.isRead ? (
                      <Text size="xs" c="dimmed" ta="right">
                        Besvarad av {booking.answeredByEmail ?? 'okänd'}{' '}
                        {booking.answeredAt && new Date(booking.answeredAt).toLocaleDateString('sv-SE', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    ) : (
                      <Group justify="flex-end">
                        <Badge
                          variant="light"
                          color="green"
                          size="lg"
                          style={{ cursor: 'pointer' }}
                          onClick={() => markAsRead.mutate(booking.id)}
                        >
                          Markera som besvarad
                        </Badge>
                      </Group>
                    )}
                </div>
              </Collapse>
            </Card>
          ))}
        </Stack>
      )}

      {/* ── Mottagare av bokningsnotiser ──────────────────── */}
      <Title order={2} mb="md">Bokningsnotiser</Title>
      <Text c="dimmed" size="sm" mb="md">
        Dessa e-postadresser får ett mail när en ny bokningsförfrågan kommer in.
      </Text>

      {recipientsLoading && (
        <Group justify="center" py="md">
          <Loader size="sm" />
        </Group>
      )}

      {recipients && recipients.length > 0 && (
        <Stack gap="xs" mb="md">
          {recipients.map((recipient) => (
            <Group key={recipient.id} justify="space-between">
              <Text size="sm">{recipient.email}</Text>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => handleDeleteRecipient(recipient.id, recipient.email)}
                loading={deleteRecipient.isPending}
                title="Ta bort"
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      )}

      {recipients && recipients.length === 0 && (
        <Text c="dimmed" size="sm" mb="md">
          Inga mottagare tillagda. Lägg till en e-post nedan.
        </Text>
      )}

      <Group gap="sm">
        <TextInput
          placeholder="namn@example.se"
          value={newEmail}
          onChange={(e) => setNewEmail(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddRecipient()}
          style={{ flex: 1 }}
        />
        <Button
          onClick={handleAddRecipient}
          loading={createRecipient.isPending}
        >
          Lägg till
        </Button>
      </Group>
    </Container>
  );
}