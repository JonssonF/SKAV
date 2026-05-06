export interface BookingRecipientResponse {
  id: number;
  email: string;
  memberId?: number;
}

export interface CreateBookingRecipientRequest {
  email: string;
  memberId?: number;
}

export interface CreateBookingRecipientResponse {
  id: number;
}