import { Modal } from '@mantine/core';
import { SongProposalForm } from './SongProposalForm';
import type { CreateSongProposalRequest } from '../../../types/songProposal.types';

interface SongProposalCreateModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSongProposalRequest) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function SongProposalCreateModal({
  opened,
  onClose,
  onSubmit,
  loading,
  errors,
}: SongProposalCreateModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Nytt låtförslag" size="lg">
      <SongProposalForm onSubmit={onSubmit} loading={loading} errors={errors} />
    </Modal>
  );
}