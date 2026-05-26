import { useState, useCallback, useEffect } from 'react';
import type { ProductResponse, ProductVariant } from '../../../types/product.types';

export interface CartItem {
  product: ProductResponse;
  variant: ProductVariant;
  quantity: number;
  isSigned: boolean;
}

const CART_KEY = 'skav-cart';

function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((
    product: ProductResponse,
    variant: ProductVariant,
    quantity: number = 1,
    isSigned: boolean = false,
  ) => {
    setItems((prev) => {
      // Samma variant + samma signeringsstatus = samma rad
      const existing = prev.find(
        (item) => item.variant.id === variant.id && item.isSigned === isSigned
      );
      if (existing) {
        return prev.map((item) =>
          item.variant.id === variant.id && item.isSigned === isSigned
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, variant, quantity, isSigned }];
    });
  }, []);

  const updateQuantity = useCallback((variantId: number, isSigned: boolean, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter(
        (item) => !(item.variant.id === variantId && item.isSigned === isSigned)
      ));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.variant.id === variantId && item.isSigned === isSigned
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const removeItem = useCallback((variantId: number, isSigned: boolean) => {
    setItems((prev) => prev.filter(
      (item) => !(item.variant.id === variantId && item.isSigned === isSigned)
    ));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => {
    const basePrice = item.variant.priceOverride ?? item.product.price;
    const signingExtra = item.isSigned ? (item.product.signingPrice ?? 0) : 0;
    return sum + (basePrice + signingExtra) * item.quantity;
  }, 0);

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
  };
}