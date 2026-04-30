import { Modal } from '@mantine/core';
import { GigForm } from './GigForm';
import type { GigResponse, UpdateGigRequest } from '../../../types/gig.types';

interface GigEditModalProps {
  gig: GigResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateGigRequest) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function GigEditModal({ gig, onClose, onSubmit, loading, errors }: GigEditModalProps) {
  return (
    <Modal opened={gig !== null} onClose={onClose} title="Redigera spelning" size="lg">
      {gig && (
        <GigForm initialData={gig} onSubmit={onSubmit} loading={loading} errors={errors} />
      )}
    </Modal>
  );
}