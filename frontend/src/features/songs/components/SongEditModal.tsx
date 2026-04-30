import { Modal } from '@mantine/core';
import { SongForm } from './SongForm';
import type { SongResponse, UpdateSongRequest } from '../../../types/song.types';

interface SongEditModalProps {
  song: SongResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateSongRequest) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function SongEditModal({ song, onClose, onSubmit, loading, errors }: SongEditModalProps) {
  return (
    <Modal opened={song !== null} onClose={onClose} title="Redigera låt" size="lg">
      {song && (
        <SongForm initialData={song} onSubmit={onSubmit} loading={loading} errors={errors} />
      )}
    </Modal>
  );
}