import { Modal, Group, Loader } from '@mantine/core';
import { LyricsForm } from './LyricsForm';
import type { SongResponse } from '../../../types/song.types';
import type { LyricsResponse } from '../../../types/lyrics.types';

interface LyricsModalProps {
  song: SongResponse | null;
  existingLyrics: LyricsResponse | null;
  lyricsLoading: boolean;
  onClose: () => void;
  onSubmit: (body: string) => void;
  saving?: boolean;
}

export function LyricsModal({ song, existingLyrics, lyricsLoading, onClose, onSubmit, saving }: LyricsModalProps) {
  return (
    <Modal
      opened={song !== null}
      onClose={onClose}
      title={song ? `Låttext — ${song.title}` : 'Låttext'}
      size="lg"
    >
      {lyricsLoading ? (
        <Group justify="center" py="xl"><Loader /></Group>
      ) : (
        song && (
          <LyricsForm
            songId={song.id}
            initialData={existingLyrics}
            onSubmit={onSubmit}
            loading={saving}
          />
        )
      )}
    </Modal>
  );
}