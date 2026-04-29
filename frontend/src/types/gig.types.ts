export interface GigResponse {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  adress?: string;
  price?: number;
  notes?: string;
  ticketUrl?: string;
}

export interface CreateGigRequest {
  title: string;
  description: string;
  location: string;
  date: string;
  adress?: string;
  price?: number;
  notes?: string;
  ticketUrl?: string;
}

export interface CreateGigResponse {
  id: number;
}

export interface UpdateGigRequest {
  title: string;
  description: string;
  location: string;
  date: string;
  adress?: string;
  price?: number;
  notes?: string;
  ticketUrl?: string;
}