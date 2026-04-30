import { Modal } from '@mantine/core';
import { AlbumForm } from './AlbumForm';
import type { AlbumResponse, UpdateAlbumRequest } from '../../../types/album.types';

interface AlbumEditModalProps {
  album: AlbumResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateAlbumRequest) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function AlbumEditModal({ album, onClose, onSubmit, loading, errors }: AlbumEditModalProps) {
  return (
    <Modal opened={album !== null} onClose={onClose} title="Redigera album" size="lg">
      {album && (
        <AlbumForm initialData={album} onSubmit={onSubmit} loading={loading} errors={errors} />
      )}
    </Modal>
  );
}