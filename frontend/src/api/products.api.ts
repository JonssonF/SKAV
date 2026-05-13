import apiClient from './axios';
import type {
  ProductResponse,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  CreateProductAttributeDefinitionRequest,
  CreateProductAttributeDefinitionResponse,
  CreateProductVariantRequest,
  CreateProductVariantResponse,
  UpdateProductVariantRequest,
} from '../types/product.types';

export const productsApi = {
  getAll: async (): Promise<ProductResponse[]> => {
    const response = await apiClient.get<ProductResponse[]>('/products');
    return response.data;
  },

  getById: async (id: number): Promise<ProductResponse> => {
    const response = await apiClient.get<ProductResponse>(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductRequest): Promise<CreateProductResponse> => {
    const response = await apiClient.post<CreateProductResponse>('/products', data);
    return response.data;
  },

  update: async (id: number, data: UpdateProductRequest): Promise<void> => {
    await apiClient.put(`/products/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  // Attribute definitions
  createAttributeDefinition: async (data: CreateProductAttributeDefinitionRequest): Promise<CreateProductAttributeDefinitionResponse> => {
    const response = await apiClient.post<CreateProductAttributeDefinitionResponse>('/product-attribute-definitions', data);
    return response.data;
  },

  deleteAttributeDefinition: async (id: number): Promise<void> => {
    await apiClient.delete(`/product-attribute-definitions/${id}`);
  },

  // Variants
  createVariant: async (data: CreateProductVariantRequest): Promise<CreateProductVariantResponse> => {
    const response = await apiClient.post<CreateProductVariantResponse>('/product-variants', data);
    return response.data;
  },

  updateVariant: async (id: number, data: UpdateProductVariantRequest): Promise<void> => {
    await apiClient.put(`/product-variants/${id}`, data);
  },

  deleteVariant: async (id: number): Promise<void> => {
    await apiClient.delete(`/product-variants/${id}`);
  },
};