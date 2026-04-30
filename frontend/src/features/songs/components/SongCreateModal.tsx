import { Modal } from '@mantine/core';
import { SongForm } from './SongForm';
import type { CreateSongRequest } from '../../../types/song.types';

interface SongCreateModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSongRequest) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function SongCreateModal({ opened, onClose, onSubmit, loading, errors }: SongCreateModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Ny låt" size="lg">
      <SongForm onSubmit={onSubmit} loading={loading} errors={errors} />
    </Modal>
  );
}