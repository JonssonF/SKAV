import { Modal } from '@mantine/core';
import { MemberForm } from './MemberForm';
import type { CreateMemberRequest } from '../../../types/member.types';

interface MemberCreateModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMemberRequest) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function MemberCreateModal({ opened, onClose, onSubmit, loading, errors }: MemberCreateModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Ny medlem" size="md">
      <MemberForm onSubmit={onSubmit} loading={loading} errors={errors} />
    </Modal>
  );
}