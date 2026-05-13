import apiClient from './axios';
import type {
  ProductOrderResponse,
  CreateProductOrderRequest,
  CreateProductOrderResponse,
} from '../types/productOrder.types';

export const productOrdersApi = {
  getAll: async (): Promise<ProductOrderResponse[]> => {
    const response = await apiClient.get<ProductOrderResponse[]>('/product-orders');
    return response.data;
  },

  getById: async (id: number): Promise<ProductOrderResponse> => {
    const response = await apiClient.get<ProductOrderResponse>(`/product-orders/${id}`);
    return response.data;
  },

  create: async (data: CreateProductOrderRequest): Promise<CreateProductOrderResponse> => {
    const response = await apiClient.post<CreateProductOrderResponse>('/product-orders', data);
    return response.data;
  },

  handle: async (id: number): Promise<void> => {
    await apiClient.put(`/product-orders/${id}/handle`);
  },
};