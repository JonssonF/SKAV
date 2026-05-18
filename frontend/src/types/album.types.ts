export interface AlbumResponse {
  id: number;
  title: string;
  coverImageUrl?: string;
  releaseDate?: string;
  spotifyUrl?: string;
  description?: string;
}

export interface CreateAlbumRequest {
  title: string;
  coverImageUrl?: string;
  releaseDate?: string;
  spotifyUrl?: string;
  description?: string;
}

export interface CreateAlbumResponse {
  id: number;
}

export interface UpdateAlbumRequest {
  title: string;
  coverImageUrl?: string;
  releaseDate?: string;
  spotifyUrl?: string;
  description?: string;
}