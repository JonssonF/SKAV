
export interface LyricsResponse {
  id: number;
  songId: number;
  slug: string;
  body: string;
}

export interface CreateLyricsRequest {
  songId: number;
  body: string;
}

export interface CreateLyricsResponse {
  id: number;
  slug: string;
}

export interface UpdateLyricsRequest {
  songId: number;
  body: string;
}

export interface UpdateLyricsResponse {}

export interface DeleteLyricsResponse {}