import { Modal } from '@mantine/core';
import { ProductForm } from './ProductForm';
import type { CreateProductRequest } from '../../../types/product.types';

interface ProductCreateModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductRequest) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function ProductCreateModal({ opened, onClose, onSubmit, loading, errors }: ProductCreateModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Ny produkt" size="md">
      <ProductForm onSubmit={onSubmit} loading={loading} errors={errors} />
    </Modal>
  );
}