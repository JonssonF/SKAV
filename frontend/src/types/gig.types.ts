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