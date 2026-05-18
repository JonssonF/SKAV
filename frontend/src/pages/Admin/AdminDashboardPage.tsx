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
  Divider,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../providers/AuthProvider';
import { useBookingRequests, useMarkBookingRead } from '../../features/booking/hooks/useBookingRequests';
import { useBookingRecipients, useCreateBookingRecipient, useDeleteBookingRecipient } from '../../features/booking/hooks/useBookingRecipients';
import { useProductOrders, useHandleProductOrder } from '../../features/shop/hooks/useProductOrders';
import { useProductOrderRecipients, useCreateProductOrderRecipient, useDeleteProductOrderRecipient } from '../../features/shop/hooks/useProductOrderRecipients';
import { useSubscribers } from '../../features/subscribers/hooks/useSubscribers';
import { getApiMessage } from '../../utils/getApiErrors';
import { IconTrash } from '@tabler/icons-react';

export function AdminDashboardPage() {
  const { user } = useAuth();

  // Bokningar
  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useBookingRequests();
  const markAsRead = useMarkBookingRead();
  const { data: bookingRecipients, isLoading: bookingRecipientsLoading } = useBookingRecipients();
  const createBookingRecipient = useCreateBookingRecipient();
  const deleteBookingRecipient = useDeleteBookingRecipient();

  // Köpförfrågningar
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useProductOrders();
  const handleOrder = useHandleProductOrder();
  const { data: orderRecipients, isLoading: orderRecipientsLoading } = useProductOrderRecipients();
  const createOrderRecipient = useCreateProductOrderRecipient();
  const deleteOrderRecipient = useDeleteProductOrderRecipient();

  // Subscribers
  const { data: subscribers } = useSubscribers();

  // State
  const [expandedBookingId, setExpandedBookingId] = useState<number | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [newBookingEmail, setNewBookingEmail] = useState('');
  const [newOrderEmail, setNewOrderEmail] = useState('');

  // Räknare
  const activeSubscribers = subscribers?.length ?? 0;
  const unreadBookings = bookings?.filter((b) => !b.isRead).length ?? 0;
  const unhandledOrders = orders?.filter((o) => !o.isHandled).length ?? 0;

  // ── Booking handlers ──────────────────────────────────
  const handleAddBookingRecipient = () => {
    if (!newBookingEmail.trim()) return;
    createBookingRecipient.mutate({ email: newBookingEmail.trim() }, {
      onSuccess: () => {
        setNewBookingEmail('');
        notifications.show({
          title: 'Mottagare tillagd',
          message: `${newBookingEmail} får nu bokningsnotiser.`,
          color: 'green',
        });
      },
      onError: (err) => {
        notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
      },
    });
  };

  const handleDeleteBookingRecipient = (id: number, email: string) => {
    if (!window.confirm(`Ta bort ${email} från mottagarlistan?`)) return;
    deleteBookingRecipient.mutate(id, {
      onSuccess: () => {
        notifications.show({
          title: 'Mottagare borttagen',
          message: `${email} får inte längre bokningsnotiser.`,
          color: 'green',
        });
      },
      onError: (err) => {
        notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
      },
    });
  };

  // ── Order handlers ────────────────────────────────────
  const handleAddOrderRecipient = () => {
    if (!newOrderEmail.trim()) return;
    createOrderRecipient.mutate({ email: newOrderEmail.trim() }, {
      onSuccess: () => {
        setNewOrderEmail('');
        notifications.show({
          title: 'Mottagare tillagd',
          message: `${newOrderEmail} får nu beställningsnotiser.`,
          color: 'green',
        });
      },
      onError: (err) => {
        notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
      },
    });
  };

  const handleDeleteOrderRecipient = (id: number, email: string) => {
    if (!window.confirm(`Ta bort ${email} från mottagarlistan?`)) return;
    deleteOrderRecipient.mutate(id, {
      onSuccess: () => {
        notifications.show({
          title: 'Mottagare borttagen',
          message: `${email} får inte längre beställningsnotiser.`,
          color: 'green',
        });
      },
      onError: (err) => {
        notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
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
          <Text size="sm" c="dimmed">Obesvarade bokningar</Text>
          <Title order={2} c={unreadBookings > 0 ? 'red' : undefined}>{unreadBookings}</Title>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flex: 1 }}>
          <Text size="sm" c="dimmed">Beställningar</Text>
          <Title order={2}>{orders?.length ?? 0}</Title>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flex: 1 }}>
          <Text size="sm" c="dimmed">Ohanterade beställningar</Text>
          <Title order={2} c={unhandledOrders > 0 ? 'red' : undefined}>{unhandledOrders}</Title>
        </Card>
      </Group>

      {/* ── Bokningsförfrågningar ────────────────────────── */}
      <Title order={2} mb="md">
        <Group gap="sm">
          Bokningsförfrågningar
          {unreadBookings > 0 && (
            <Badge color="red" size="lg">{unreadBookings} nya</Badge>
          )}
        </Group>
      </Title>

      {bookingsLoading && (
        <Group justify="center" py="xl"><Loader size="lg" /></Group>
      )}

      {bookingsError && (
        <Alert color="red" title="Något gick fel" mb="md">
          Kunde inte hämta bokningsförfrågningar.
        </Alert>
      )}

      {!bookingsLoading && !bookingsError && (!bookings || bookings.length === 0) && (
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
              onClick={() => setExpandedBookingId(expandedBookingId === booking.id ? null : booking.id)}
            >
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

              <Collapse expanded={expandedBookingId === booking.id}>
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

      {/* ── Bokningsnotiser ──────────────────────────────── */}
      <Title order={3} mb="md">Bokningsnotiser</Title>
      <Text c="dimmed" size="sm" mb="md">
        Dessa e-postadresser får ett mail när en ny bokningsförfrågan kommer in.
      </Text>

      {bookingRecipientsLoading && (
        <Group justify="center" py="md"><Loader size="sm" /></Group>
      )}

      {bookingRecipients && bookingRecipients.length > 0 && (
        <Stack gap="xs" mb="md">
          {bookingRecipients.map((recipient) => (
            <Group key={recipient.id} justify="space-between">
              <Text size="sm">{recipient.email}</Text>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => handleDeleteBookingRecipient(recipient.id, recipient.email)}
                loading={deleteBookingRecipient.isPending}
                title="Ta bort"
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      )}

      {bookingRecipients && bookingRecipients.length === 0 && (
        <Text c="dimmed" size="sm" mb="md">Inga mottagare tillagda.</Text>
      )}

      <Group gap="sm" mb="xl">
        <TextInput
          placeholder="namn@example.se"
          value={newBookingEmail}
          onChange={(e) => setNewBookingEmail(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddBookingRecipient()}
          style={{ flex: 1 }}
        />
        <Button onClick={handleAddBookingRecipient} loading={createBookingRecipient.isPending}>
          Lägg till
        </Button>
      </Group>

      <Divider my="xl" />

      {/* ── Köpförfrågningar ─────────────────────────────── */}
      <Title order={2} mb="md">
        <Group gap="sm">
          Köpförfrågningar
          {unhandledOrders > 0 && (
            <Badge color="red" size="lg">{unhandledOrders} nya</Badge>
          )}
        </Group>
      </Title>

      {ordersLoading && (
        <Group justify="center" py="xl"><Loader size="lg" /></Group>
      )}

      {ordersError && (
        <Alert color="red" title="Något gick fel" mb="md">
          Kunde inte hämta köpförfrågningar.
        </Alert>
      )}

      {!ordersLoading && !ordersError && (!orders || orders.length === 0) && (
        <Text c="dimmed" mb="xl">Inga köpförfrågningar ännu.</Text>
      )}

      {orders && orders.length > 0 && (
        <Stack gap="xs" mb="xl">
          {orders.map((order) => {
            const totalPrice = order.items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);

            return (
              <Card
                key={order.id}
                shadow="sm"
                padding="md"
                radius="md"
                withBorder
                style={{
                  opacity: order.isHandled ? 0.7 : 1,
                  borderLeft: order.isHandled ? undefined : '3px solid var(--mantine-color-orange-filled)',
                  cursor: 'pointer',
                }}
                onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
              >
                <Group justify="space-between">
                  <Group gap="sm">
                    <Text fw={700}>{order.name}</Text>
                    <Badge variant="light" color="gray" size="sm">
                      {order.items.length} {order.items.length === 1 ? 'produkt' : 'produkter'}
                    </Badge>
                    <Badge variant="light" size="sm">{totalPrice} kr</Badge>
                    {!order.isHandled && (
                      <Badge color="orange" size="sm">Ny</Badge>
                    )}
                  </Group>
                  <Text size="sm" c="dimmed">
                    {new Date(order.createdAt).toLocaleDateString('sv-SE', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </Group>

                <Collapse expanded={expandedOrderId === order.id}>
                  <div style={{ paddingTop: 12 }} onClick={(e) => e.stopPropagation()}>
                    <Table withRowBorders={false} mb="sm">
                      <Table.Tbody>
                        <Table.Tr>
                          <Table.Td w={100}><Text size="sm" c="dimmed">E-post</Text></Table.Td>
                          <Table.Td><Text size="sm">{order.email}</Text></Table.Td>
                        </Table.Tr>
                        {order.phone && (
                          <Table.Tr>
                            <Table.Td><Text size="sm" c="dimmed">Telefon</Text></Table.Td>
                            <Table.Td><Text size="sm">{order.phone}</Text></Table.Td>
                          </Table.Tr>
                        )}
                      </Table.Tbody>
                    </Table>

                    {/* Produktlista */}
                    <Table mb="sm">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Produkt</Table.Th>
                          <Table.Th>Variant</Table.Th>
                          <Table.Th>Antal</Table.Th>
                          <Table.Th>Pris</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {order.items.map((item, i) => {
                          const attrs = JSON.parse(item.variantAttributes) as Record<string, string>;
                          const attrText = Object.entries(attrs)
                            .map(([key, val]) => `${key}: ${val}`)
                            .join(', ');

                          return (
                            <Table.Tr key={i}>
                              <Table.Td><Text size="sm">{item.productTitle}</Text></Table.Td>
                              <Table.Td><Text size="sm" c="dimmed">{attrText || 'Standard'}</Text></Table.Td>
                              <Table.Td><Text size="sm">{item.quantity}</Text></Table.Td>
                              <Table.Td><Text size="sm">{item.productPrice * item.quantity} kr</Text></Table.Td>
                            </Table.Tr>
                          );
                        })}
                      </Table.Tbody>
                    </Table>

                    {order.message && (
                      <Text size="sm" mb="md">{order.message}</Text>
                    )}

                    {order.isHandled ? (
                      <Text size="xs" c="dimmed" ta="right">
                        Hanterad av {order.handledByEmail ?? 'okänd'}{' '}
                        {order.handledAt && new Date(order.handledAt).toLocaleDateString('sv-SE', {
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
                          onClick={() => handleOrder.mutate(order.id)}
                        >
                          Markera som hanterad
                        </Badge>
                      </Group>
                    )}
                  </div>
                </Collapse>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* ── Beställningsnotiser ──────────────────────────── */}
      <Title order={3} mb="md">Beställningsnotiser</Title>
      <Text c="dimmed" size="sm" mb="md">
        Dessa e-postadresser får ett mail när en ny beställning kommer in.
      </Text>

      {orderRecipientsLoading && (
        <Group justify="center" py="md"><Loader size="sm" /></Group>
      )}

      {orderRecipients && orderRecipients.length > 0 && (
        <Stack gap="xs" mb="md">
          {orderRecipients.map((recipient) => (
            <Group key={recipient.id} justify="space-between">
              <Text size="sm">{recipient.email}</Text>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => handleDeleteOrderRecipient(recipient.id, recipient.email)}
                loading={deleteOrderRecipient.isPending}
                title="Ta bort"
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      )}

      {orderRecipients && orderRecipients.length === 0 && (
        <Text c="dimmed" size="sm" mb="md">Inga mottagare tillagda.</Text>
      )}

      <Group gap="sm">
        <TextInput
          placeholder="namn@example.se"
          value={newOrderEmail}
          onChange={(e) => setNewOrderEmail(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddOrderRecipient()}
          style={{ flex: 1 }}
        />
        <Button onClick={handleAddOrderRecipient} loading={createOrderRecipient.isPending}>
          Lägg till
        </Button>
      </Group>
    </Container>
  );
}