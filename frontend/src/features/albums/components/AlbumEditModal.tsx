import { Modal } from '@mantine/core';
import { AlbumForm } from './AlbumForm';
import type { AlbumResponse, UpdateAlbumRequest } from '../../../types/album.types';

interface AlbumEditModalProps {
  opened: boolean;
  onClose: () => void;
  album: AlbumResponse | null;
  onSubmit: (data: UpdateAlbumRequest) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function AlbumEditModal({ opened, onClose, album, onSubmit, loading, errors }: AlbumEditModalProps) {
  if (!album) return null;

  return (
    <Modal opened={opened} onClose={onClose} title={`Redigera: ${album.title}`} size="lg">
      <AlbumForm initialData={album} onSubmit={onSubmit} loading={loading} errors={errors} />
    </Modal>
  );
}