import { useState } from 'react';
import {
  Container,
  Title,
  Button,
  Modal,
  Table,
  Group,
  Text,
  Alert,
  Loader,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useGigs, useCreateGig, useUpdateGig, useDeleteGig } from '../../features/gigs/hooks/useGigs';
import { GigForm } from '../../features/gigs/components/GigForm';
import { getApiErrors, getApiMessage } from '../../utils/getApiErrors';
import type { GigResponse } from '../../types/gig.types';

export function AdminGigsPage() {
  const { data: gigs, isLoading, error } = useGigs();
  const createGig = useCreateGig();
  const updateGig = useUpdateGig();
  const deleteGig = useDeleteGig();

  const [createOpen, setCreateOpen] = useState(false);
  const [editGig, setEditGig] = useState<GigResponse | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string> | null>(null);

  const handleCreate = (data: Parameters<typeof createGig.mutate>[0]) => {
    setFormErrors(null);
    createGig.mutate(data, {
      onSuccess: () => {
        setCreateOpen(false);
        notifications.show({
          title: 'Spelning skapad',
          message: 'Den nya spelningen har lagts till.',
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

  const handleUpdate = (data: Parameters<typeof updateGig.mutate>[0]['data']) => {
    if (!editGig) return;
    setFormErrors(null);
    updateGig.mutate(
      { id: editGig.id, data },
      {
        onSuccess: () => {
          setEditGig(null);
          notifications.show({
            title: 'Spelning uppdaterad',
            message: 'Ändringarna har sparats.',
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
      }
    );
  };

  const handleDelete = (gig: GigResponse) => {
    if (!window.confirm(`Vill du ta bort "${gig.title}"?`)) return;
    deleteGig.mutate(gig.id, {
      onSuccess: () => {
        notifications.show({
          title: 'Spelning borttagen',
          message: `"${gig.title}" har tagits bort.`,
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

  // Rensa errors när modaler stängs
  const handleCloseCreate = () => {
    setCreateOpen(false);
    setFormErrors(null);
  };

  const handleCloseEdit = () => {
    setEditGig(null);
    setFormErrors(null);
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
          Kunde inte hämta spelningar.
        </Alert>
      </Container>
    );
  }

  return (
    <Container py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Hantera spelningar</Title>
        <Button onClick={() => setCreateOpen(true)}>Ny spelning</Button>
      </Group>

      {!gigs || gigs.length === 0 ? (
        <Text c="dimmed">Inga spelningar än. Skapa den första!</Text>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Titel</Table.Th>
              <Table.Th>Plats</Table.Th>
              <Table.Th>Datum</Table.Th>
              <Table.Th>Pris</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {gigs.map((gig) => (
              <Table.Tr key={gig.id}>
                <Table.Td>{gig.title}</Table.Td>
                <Table.Td>{gig.location}</Table.Td>
                <Table.Td>
                  {new Date(gig.date).toLocaleDateString('sv-SE')}
                </Table.Td>
                <Table.Td>
                  {gig.price != null ? `${gig.price} kr` : 'Gratis'}
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Button
                      variant="light"
                      size="xs"
                      onClick={() => setEditGig(gig)}
                    >
                      Redigera
                    </Button>
                    <Button
                      variant="light"
                      color="red"
                      size="xs"
                      onClick={() => handleDelete(gig)}
                      loading={deleteGig.isPending}
                    >
                      Ta bort
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <Modal
        opened={createOpen}
        onClose={handleCloseCreate}
        title="Ny spelning"
        size="lg"
      >
        <GigForm
          onSubmit={handleCreate}
          loading={createGig.isPending}
          errors={formErrors}
        />
      </Modal>

      <Modal
        opened={editGig !== null}
        onClose={handleCloseEdit}
        title="Redigera spelning"
        size="lg"
      >
        {editGig && (
          <GigForm
            initialData={editGig}
            onSubmit={handleUpdate}
            loading={updateGig.isPending}
            errors={formErrors}
          />
        )}
      </Modal>
    </Container>
  );
}