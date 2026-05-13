import apiClient from './axios';
import type {
  ProductOrderRecipientResponse,
  CreateProductOrderRecipientRequest,
  CreateProductOrderRecipientResponse,
} from '../types/productOrderRecipient.types';

export const productOrderRecipientsApi = {
  getAll: async (): Promise<ProductOrderRecipientResponse[]> => {
    const response = await apiClient.get<ProductOrderRecipientResponse[]>('/product-order-recipients');
    return response.data;
  },

  create: async (data: CreateProductOrderRecipientRequest): Promise<CreateProductOrderRecipientResponse> => {
    const response = await apiClient.post<CreateProductOrderRecipientResponse>('/product-order-recipients', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/product-order-recipients/${id}`);
  },
};