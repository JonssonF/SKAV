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
  CreateProductImageRequest,
  UpdateProductImageRequest,
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

  // Images
  uploadImage: async (file: File, folder: string): Promise<{ url?: string; error?: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/upload/${folder}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  createImage: async (data: CreateProductImageRequest): Promise<{ id: number }> => {
    const response = await apiClient.post<{ id: number }>('/product-images', data);
    return response.data;
  },

  updateImage: async (id: number, data: UpdateProductImageRequest): Promise<void> => {
    await apiClient.put(`/product-images/${id}`, data);
  },

  deleteImage: async (id: number): Promise<void> => {
    await apiClient.delete(`/product-images/${id}`);
  },
};