import { Modal } from '@mantine/core';
import { MemberForm } from './MemberForm';
import type { MemberResponse, UpdateMemberRequest } from '../../../types/member.types';

interface MemberEditModalProps {
  member: MemberResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateMemberRequest) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function MemberEditModal({ member, onClose, onSubmit, loading, errors }: MemberEditModalProps) {
  return (
    <Modal opened={member !== null} onClose={onClose} title="Redigera medlem" size="md">
      {member && (
        <MemberForm initialData={member} onSubmit={onSubmit} loading={loading} errors={errors} />
      )}
    </Modal>
  );
}