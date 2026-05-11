import { useState } from 'react';
import { Modal, Select, Button, Stack, Group, Text } from '@mantine/core';
import { useMembers } from '../../members/hooks/useMembers';
import type { UserResponse, LinkMemberRequest } from '../../../types/user.types';

interface LinkMemberModalProps {
  user: UserResponse | null;
  onClose: () => void;
  onSubmit: (data: LinkMemberRequest) => void;
  loading?: boolean;
}

export function LinkMemberModal({ user, onClose, onSubmit, loading }: LinkMemberModalProps) {
  const { data: members } = useMembers();
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // Filtrera bort medlemmar som redan är kopplade till en user
  const availableMembers = (members ?? [])
    .filter((m) => !m.userId)
    .map((m) => ({ value: String(m.id), label: m.name }));

  const selectedMember = members?.find((m) => String(m.id) === selectedMemberId);

  const handleSubmit = () => {
    if (!selectedMemberId) return;
    onSubmit({ memberId: Number(selectedMemberId) });
    setSelectedMemberId(null);
  };

  return (
    <Modal
      opened={user !== null}
      onClose={() => {
        onClose();
        setSelectedMemberId(null);
      }}
      title="Koppla till bandmedlem"
      size="md"
    >
      {user && (
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Koppla <Text span fw={700}>{user.email}</Text> till en bandmedlem.
          </Text>

          <Select
            label="Välj bandmedlem"
            placeholder="Sök eller välj..."
            data={availableMembers}
            value={selectedMemberId}
            onChange={setSelectedMemberId}
            searchable
            nothingFoundMessage="Inga lediga medlemmar"
          />

          {selectedMember && (
            <Text size="sm">
              Vill du koppla <Text span fw={700}>{user.email}</Text> till{' '}
              <Text span fw={700}>{selectedMember.name}</Text>? Endast admin kan bryta kopplingen.
            </Text>
          )}

          <Group justify="flex-end">
            <Button variant="subtle" onClick={onClose} disabled={loading}>
              Avbryt
            </Button>
            <Button
              onClick={handleSubmit}
              loading={loading}
              disabled={!selectedMemberId}
            >
              Koppla
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
}