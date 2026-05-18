export interface SongResponse {
  id: number;
  albumId?: number;
  title: string;
  durationSeconds?: number;
  spotifyUrl?: string;
  musicWriter?: string;
  lyricsWriter?: string;
  trackNumber?: number;
  youtubeUrl?: string;
  year?: number;
}

export interface CreateSongRequest {
  albumId?: number;
  title: string;
  durationSeconds?: number;
  spotifyUrl?: string;
  musicWriter?: string;
  lyricsWriter?: string;
  trackNumber?: number;
  youtubeUrl?: string;
  year?: number;
}

export interface CreateSongResponse {
  id: number;
}

export interface UpdateSongRequest {
  albumId?: number;
  title: string;
  durationSeconds?: number;
  spotifyUrl?: string;
  musicWriter?: string;
  lyricsWriter?: string;
  trackNumber?: number;
  youtubeUrl?: string;
  year?: number;
}