import { Modal } from '@mantine/core';
import { UserCreateForm } from './UserCreateForm';
import type { CreateUserRequest } from '../../../types/user.types';

interface UserCreateModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserRequest) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function UserCreateModal({ opened, onClose, onSubmit, loading, errors }: UserCreateModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Ny användare" size="md">
      <UserCreateForm onSubmit={onSubmit} loading={loading} errors={errors} />
    </Modal>
  );
}