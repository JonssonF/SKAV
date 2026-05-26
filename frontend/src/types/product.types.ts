// === Bilder ===

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface CreateProductImageRequest {
  productId: number;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface UpdateProductImageRequest {
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

// === Attribut ===

export interface ProductAttributeDefinition {
  id: number;
  name: string;
  attributeValues: string;
  displayOrder: number;
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

// === Varianter ===

export interface ProductVariant {
  id: number;
  attributes: string;
  priceOverride?: number;
  stockQuantity: number;
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

// === Produkt ===

export interface ProductResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  category?: string;
  isSignable: boolean;
  signingPrice?: number;
  images: ProductImage[];
  attributeDefinitions: ProductAttributeDefinition[];
  variants: ProductVariant[];
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  category?: string;
  isSignable: boolean;
  signingPrice?: number;
}

export interface CreateProductResponse {
  id: number;
}

export interface UpdateProductRequest {
  title: string;
  description: string;
  price: number;
  category?: string;
  isSignable: boolean;
  signingPrice?: number;
}