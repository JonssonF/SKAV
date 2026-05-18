export interface SongResponse {
  id: number;
  title: string;
  durationSeconds?: number;
  spotifyUrl?: string;
  writer?: string;
}

export interface CreateSongRequest {
  title: string;
  durationSeconds?: number;
  spotifyUrl?: string;
  writer?: string;
}

export interface CreateSongResponse {
  id: number;
}

export interface UpdateSongRequest {
  title: string;
  durationSeconds?: number;
  spotifyUrl?: string;
  writer?: string;
}