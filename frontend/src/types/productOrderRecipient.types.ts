export interface ProductOrderRecipientResponse {
  id: number;
  email: string;
  memberId?: number;
}

export interface CreateProductOrderRecipientRequest {
  email: string;
  memberId?: number;
}

export interface CreateProductOrderRecipientResponse {
  id: number;
}