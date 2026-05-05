export interface BookingRequestResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  eventDate?: string;
  eventType?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreateBookingRequest {
  name: string;
  email: string;
  phone?: string;
  eventDate?: string;
  eventType?: string;
  message: string;
}

export interface CreateBookingRequestResponse {
  id: number;
}