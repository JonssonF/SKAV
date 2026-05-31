export interface SendNewsletterRequest {
  subject: string;
  body: string;
}

export interface SendNewsletterResponse {
  totalSubscribers: number;
  sent: number;
  failed: number;
}

export interface PreviewNewsletterRequest {
  subject: string;
  body: string;
}

export interface PreviewNewsletterResponse {
  html: string;
}