import { Modal } from '@mantine/core';
import { GigForm } from './GigForm';
import type { CreateGigRequest } from '../../../types/gig.types';

interface GigCreateModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGigRequest) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function GigCreateModal({ opened, onClose, onSubmit, loading, errors }: GigCreateModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Ny spelning" size="lg">
      <GigForm onSubmit={onSubmit} loading={loading} errors={errors} />
    </Modal>
  );
}