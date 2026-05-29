import { Modal } from '@mantine/core';
import { AlbumForm } from './AlbumForm';
import type { CreateAlbumRequest } from '../../../types/album.types';

interface AlbumCreateModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAlbumRequest) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function AlbumCreateModal({ opened, onClose, onSubmit, loading, errors }: AlbumCreateModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Skapa album" size="lg">
      <AlbumForm onSubmit={onSubmit} loading={loading} errors={errors} />
    </Modal>
  );
}