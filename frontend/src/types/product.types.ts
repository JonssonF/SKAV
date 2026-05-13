export interface ProductAttributeDefinition {
  id: number;
  name: string;
  attributeValues: string; // JSON: ["S","M","L","XL"]
  displayOrder: number;
}

export interface ProductVariant {
  id: number;
  attributes: string; // JSON: {"Storlek":"M","Färg":"Röd"}
  priceOverride?: number;
  stockQuantity: number;
}

export interface ProductResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  attributeDefinitions: ProductAttributeDefinition[];
  variants: ProductVariant[];
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

export interface CreateProductResponse {
  id: number;
}

export interface UpdateProductRequest {
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

export interface CreateProductAttributeDefinitionRequest {
  productId: number;
  name: string;
  attributeValues: string;
  displayOrder: number;
}

export interface CreateProductAttributeDefinitionResponse {
  id: number;
}

export interface CreateProductVariantRequest {
  productId: number;
  attributes: string;
  priceOverride?: number;
  stockQuantity: number;
}

export interface CreateProductVariantResponse {
  id: number;
}

export interface UpdateProductVariantRequest {
  attributes: string;
  priceOverride?: number;
  stockQuantity: number;
}