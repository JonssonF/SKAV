export interface SendNewsletterRequest {
  subject: string;
  body: string;
}

export interface SendNewsletterResponse {
  totalSubscribers: number;
  sent: number;
  failed: number;
}