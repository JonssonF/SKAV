export interface SongProposalVoteSnapshotResponse {
  voteCount: number;
  snapshotDate: string;
}

export interface SongProposalResponse {
  id: number;
  title: string;
  description?: string;
  lyricsBody?: string;
  isActive: boolean;
  isWinner: boolean;
  voteCount: number;
  createdByEmail?: string;
  voteHistory: SongProposalVoteSnapshotResponse[];
}

export interface CreateSongProposalRequest {
  title: string;
  description?: string;
  lyricsBody?: string;
  isActive: boolean;
}

export interface UpdateSongProposalRequest {
  title: string;
  description?: string;
  lyricsBody?: string;
  isActive: boolean;
}