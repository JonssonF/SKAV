import { Modal } from '@mantine/core';
import { ChangePasswordForm } from './ChangePasswordForm';
import type { ChangePasswordRequest } from '../../../types/user.types';

interface ChangePasswordModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: ChangePasswordRequest) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function ChangePasswordModal({ opened, onClose, onSubmit, loading, errors }: ChangePasswordModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Byt lösenord" size="md">
      <ChangePasswordForm onSubmit={onSubmit} loading={loading} errors={errors} />
    </Modal>
  );
}