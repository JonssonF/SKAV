export interface SongResponse {
  id: number;
  albumId?: number;
  title: string;
  durationSeconds?: number;
  spotifyUrl?: string;
  writer?: string;
  trackNumber?: number;
}

export interface CreateSongRequest {
  albumId?: number;
  title: string;
  durationSeconds?: number;
  spotifyUrl?: string;
  writer?: string;
  trackNumber?: number;
}

export interface CreateSongResponse {
  id: number;
}

export interface UpdateSongRequest {
  albumId?: number;
  title: string;
  durationSeconds?: number;
  spotifyUrl?: string;
  writer?: string;
  trackNumber?: number;
}