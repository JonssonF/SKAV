import { Modal } from '@mantine/core';
import { ProductForm } from './ProductForm';
import type { ProductResponse, UpdateProductRequest } from '../../../types/product.types';

interface ProductEditModalProps {
  product: ProductResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateProductRequest) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function ProductEditModal({ product, onClose, onSubmit, loading, errors }: ProductEditModalProps) {
  return (
    <Modal opened={product !== null} onClose={onClose} title="Redigera produkt" size="md">
      {product && (
        <ProductForm initialData={product} onSubmit={onSubmit} loading={loading} errors={errors} />
      )}
    </Modal>
  );
}