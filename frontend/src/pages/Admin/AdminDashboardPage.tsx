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
  SimpleGrid,
  Pagination,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../providers/AuthProvider';
import { useBookingRequests, useMarkBookingRead, useDeleteBookingRequest } from '../../features/booking/hooks/useBookingRequests';
import { useBookingRecipients, useCreateBookingRecipient, useDeleteBookingRecipient } from '../../features/booking/hooks/useBookingRecipients';
import { useProductOrders, useHandleProductOrder, useCancelProductOrder, useDeleteProductOrder } from '../../features/shop/hooks/useProductOrders';
import { useProductOrderRecipients, useCreateProductOrderRecipient, useDeleteProductOrderRecipient } from '../../features/shop/hooks/useProductOrderRecipients';
import { useSubscribers } from '../../features/subscribers/hooks/useSubscribers';
import { getApiMessage } from '../../utils/getApiErrors';
import { IconTrash } from '@tabler/icons-react';

const INITIAL_COUNT = 5;
const PAGE_SIZE = 10;

export function AdminDashboardPage() {
  const { user } = useAuth();

  // Bokningar
  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useBookingRequests();
  const markAsRead = useMarkBookingRead();
  const deleteBookingRequest = useDeleteBookingRequest();
  const { data: bookingRecipients, isLoading: bookingRecipientsLoading } = useBookingRecipients();
  const createBookingRecipient = useCreateBookingRecipient();
  const deleteBookingRecipient = useDeleteBookingRecipient();

  // Köpförfrågningar
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useProductOrders();
  const handleOrder = useHandleProductOrder();
  const cancelOrder = useCancelProductOrder();
  const deleteProductOrder = useDeleteProductOrder();
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

  // Paginering – bokningar
  const [bookingsExpanded, setBookingsExpanded] = useState(false);
  const [bookingsPage, setBookingsPage] = useState(1);

  // Paginering – köpförfrågningar
  const [ordersExpanded, setOrdersExpanded] = useState(false);
  const [ordersPage, setOrdersPage] = useState(1);

  // Räknare
  const activeSubscribers = subscribers?.length ?? 0;
  const unreadBookings = bookings?.filter((b) => !b.isRead).length ?? 0;
  const unhandledOrders = orders?.filter((o) => !o.isHandled && !o.isCancelled).length ?? 0;

  // Paginering – beräkna synliga bokningar
  const totalBookings = bookings?.length ?? 0;
  const bookingsShowCount = bookingsExpanded ? PAGE_SIZE : INITIAL_COUNT;
  const bookingsTotalPages = bookingsExpanded ? Math.ceil(totalBookings / PAGE_SIZE) : 1;
  const bookingsStart = bookingsExpanded ? (bookingsPage - 1) * PAGE_SIZE : 0;
  const visibleBookings = bookings?.slice(bookingsStart, bookingsStart + bookingsShowCount) ?? [];
  const showBookingsExpandButton = !bookingsExpanded && totalBookings > INITIAL_COUNT;

  // Paginering – beräkna synliga köpförfrågningar
  const totalOrders = orders?.length ?? 0;
  const ordersShowCount = ordersExpanded ? PAGE_SIZE : INITIAL_COUNT;
  const ordersTotalPages = ordersExpanded ? Math.ceil(totalOrders / PAGE_SIZE) : 1;
  const ordersStart = ordersExpanded ? (ordersPage - 1) * PAGE_SIZE : 0;
  const visibleOrders = orders?.slice(ordersStart, ordersStart + ordersShowCount) ?? [];
  const showOrdersExpandButton = !ordersExpanded && totalOrders > INITIAL_COUNT;

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

  const handleDeleteBooking = (id: number) => {
    if (!window.confirm('Vill du ta bort denna bokningsförfrågan?')) return;
    deleteBookingRequest.mutate(id, {
      onSuccess: () => {
        setExpandedBookingId(null);
        notifications.show({ title: 'Borttagen', message: 'Bokningsförfrågan borttagen.', color: 'green' });
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

  const handleDeleteOrder = (id: number) => {
    if (!window.confirm('Vill du ta bort denna beställning?')) return;
    deleteProductOrder.mutate(id, {
      onSuccess: () => {
        setExpandedOrderId(null);
        notifications.show({ title: 'Borttagen', message: 'Beställning borttagen.', color: 'green' });
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
      <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} mb="xl">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="sm" c="dimmed">Prenumeranter</Text>
          <Title order={2}>{activeSubscribers}</Title>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="sm" c="dimmed">Bokningsförfrågningar</Text>
          <Title order={2}>{totalBookings}</Title>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="sm" c="dimmed">Obesvarade bokningar</Text>
          <Title order={2} c={unreadBookings > 0 ? 'red' : undefined}>{unreadBookings}</Title>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="sm" c="dimmed">Beställningar</Text>
          <Title order={2}>{totalOrders}</Title>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="sm" c="dimmed">Ohanterade beställningar</Text>
          <Title order={2} c={unhandledOrders > 0 ? 'red' : undefined}>{unhandledOrders}</Title>
        </Card>
      </SimpleGrid>

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

      {!bookingsLoading && !bookingsError && totalBookings === 0 && (
        <Text c="dimmed" mb="xl">Inga bokningsförfrågningar ännu.</Text>
      )}

      {totalBookings > 0 && (
        <Stack gap="xs" mb="md">
          {visibleBookings.map((booking) => (
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
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Text>
                          </Table.Td>
                        </Table.Tr>
                      )}
                    </Table.Tbody>
                  </Table>

                  <Text size="sm" mb="md">{booking.message}</Text>

                  {booking.isRead ? (
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">
                        Besvarad av {booking.answeredByEmail ?? 'okänd'}{' '}
                        {booking.answeredAt && new Date(booking.answeredAt).toLocaleDateString('sv-SE', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDeleteBooking(booking.id)}
                        loading={deleteBookingRequest.isPending}
                        title="Ta bort"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  ) : (
                    <Group justify="flex-end" gap="sm">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDeleteBooking(booking.id)}
                        loading={deleteBookingRequest.isPending}
                        title="Ta bort"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
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

      {/* Visa fler / Paginering – bokningar */}
      {showBookingsExpandButton && (
        <Group justify="center" mb="md">
          <Button
            variant="light"
            onClick={() => {
              setBookingsExpanded(true);
              setBookingsPage(1);
            }}
          >
            Visa fler ({totalBookings - INITIAL_COUNT} till)
          </Button>
        </Group>
      )}

      {bookingsExpanded && bookingsTotalPages > 1 && (
        <Group justify="center" mb="xl">
          <Pagination
            total={bookingsTotalPages}
            value={bookingsPage}
            onChange={setBookingsPage}
          />
        </Group>
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

      {!ordersLoading && !ordersError && totalOrders === 0 && (
        <Text c="dimmed" mb="xl">Inga köpförfrågningar ännu.</Text>
      )}

      {totalOrders > 0 && (
        <Stack gap="xs" mb="md">
          {visibleOrders.map((order) => {
            const totalPrice = order.items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);

            return (
              <Card
                key={order.id}
                shadow="sm"
                padding="md"
                radius="md"
                withBorder
                style={{
                  opacity: order.isHandled || order.isCancelled ? 0.7 : 1,
                  borderLeft: order.isCancelled
                    ? '3px solid var(--mantine-color-red-filled)'
                    : order.isHandled
                      ? undefined
                      : '3px solid var(--mantine-color-orange-filled)',
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
                    {order.isCancelled && (
                      <Badge color="red" size="sm">Avbruten</Badge>
                    )}
                    {!order.isHandled && !order.isCancelled && (
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
                        {(order.address || order.city || order.postalCode) && (
                          <Table.Tr>
                            <Table.Td><Text size="sm" c="dimmed">Adress</Text></Table.Td>
                            <Table.Td>
                              <Text size="sm">
                                {[order.address, `${order.postalCode ?? ''} ${order.city ?? ''}`.trim()].filter(Boolean).join(', ')}
                              </Text>
                            </Table.Td>
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

                    {order.isCancelled ? (
                      <Group justify="space-between">
                        <Text size="xs" c="red">
                          Avbruten av {order.cancelledByEmail ?? 'okänd'}{' '}
                          {order.cancelledAt && new Date(order.cancelledAt).toLocaleDateString('sv-SE', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleDeleteOrder(order.id)}
                          loading={deleteProductOrder.isPending}
                          title="Ta bort"
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    ) : order.isHandled ? (
                      <Group justify="space-between">
                        <Text size="xs" c="dimmed">
                          Hanterad av {order.handledByEmail ?? 'okänd'}{' '}
                          {order.handledAt && new Date(order.handledAt).toLocaleDateString('sv-SE', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleDeleteOrder(order.id)}
                          loading={deleteProductOrder.isPending}
                          title="Ta bort"
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    ) : (
                      <Group justify="flex-end" gap="sm">
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleDeleteOrder(order.id)}
                          loading={deleteProductOrder.isPending}
                          title="Ta bort"
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                        <Badge
                          variant="light"
                          color="red"
                          size="lg"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            if (window.confirm('Vill du avbryta denna beställning? Lagersaldo återställs.')) {
                              cancelOrder.mutate(order.id);
                            }
                          }}
                        >
                          Avbryt beställning
                        </Badge>
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

      {/* Visa fler / Paginering – köpförfrågningar */}
      {showOrdersExpandButton && (
        <Group justify="center" mb="md">
          <Button
            variant="light"
            onClick={() => {
              setOrdersExpanded(true);
              setOrdersPage(1);
            }}
          >
            Visa fler ({totalOrders - INITIAL_COUNT} till)
          </Button>
        </Group>
      )}

      {ordersExpanded && ordersTotalPages > 1 && (
        <Group justify="center" mb="xl">
          <Pagination
            total={ordersTotalPages}
            value={ordersPage}
            onChange={setOrdersPage}
          />
        </Group>
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