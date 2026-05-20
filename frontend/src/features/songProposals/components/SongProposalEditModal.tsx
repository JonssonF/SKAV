import { Modal } from '@mantine/core';
import { SongProposalForm } from './SongProposalForm';
import type {
  SongProposalResponse,
  UpdateSongProposalRequest,
} from '../../../types/songProposal.types';

interface SongProposalEditModalProps {
  proposal: SongProposalResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateSongProposalRequest) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function SongProposalEditModal({
  proposal,
  onClose,
  onSubmit,
  loading,
  errors,
}: SongProposalEditModalProps) {
  return (
    <Modal opened={!!proposal} onClose={onClose} title="Redigera låtförslag" size="lg">
      {proposal && (
        <SongProposalForm
          initialData={proposal}
          onSubmit={onSubmit}
          loading={loading}
          errors={errors}
        />
      )}
    </Modal>
  );
}