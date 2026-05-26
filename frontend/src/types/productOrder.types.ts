export interface ProductOrderItemDto {
  productId: number;
  productTitle: string;
  productPrice: number;
  productVariantId: number;
  variantAttributes: string;
  quantity: number;
  isSigned: boolean;
  signingPrice?: number;
}

export interface ProductOrderResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  message?: string;
  isHandled: boolean;
  handledAt?: string;
  handledBy?: number;
  handledByEmail?: string;
  isCancelled: boolean;
  cancelledAt?: string;
  cancelledBy?: number;
  cancelledByEmail?: string;
  createdAt: string;
  items: ProductOrderItemDto[];
}

export interface CreateProductOrderRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  message?: string;
  items: CreateProductOrderItemRequest[];
}

export interface CreateProductOrderItemRequest {
  productVariantId: number;
  quantity: number;
  isSigned: boolean;
}

export interface CreateProductOrderResponse {
  id: number;
}