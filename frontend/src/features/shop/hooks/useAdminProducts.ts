import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useCreateAttributeDefinition,
  useDeleteAttributeDefinition,
  useCreateVariant,
  useUpdateVariant,
  useDeleteVariant,
} from './useProducts';
import { getApiErrors, getApiMessage } from '../../../utils/getApiErrors';
import type {
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest,
  CreateProductAttributeDefinitionRequest,
  CreateProductVariantRequest,
  UpdateProductVariantRequest,
} from '../../../types/product.types';

export function useAdminProducts() {
  const { data: products, isLoading, error } = useProducts();
  const queryClient = useQueryClient();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const createAttr = useCreateAttributeDefinition();
  const deleteAttr = useDeleteAttributeDefinition();
  const createVariant = useCreateVariant();
  const updateVariant = useUpdateVariant();
  const deleteVariant = useDeleteVariant();

  // Create modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [createErrors, setCreateErrors] = useState<Record<string, string> | null>(null);

  // Edit modal state
  const [editProduct, setEditProduct] = useState<ProductResponse | null>(null);
  const [editErrors, setEditErrors] = useState<Record<string, string> | null>(null);

  // Manage modal state (attribut + varianter)
  const [manageProduct, setManageProduct] = useState<ProductResponse | null>(null);

  // --- Create ---
  const openCreate = () => {
    setCreateErrors(null);
    setCreateOpen(true);
  };

  const closeCreate = () => {
    setCreateOpen(false);
    setCreateErrors(null);
  };

  const handleCreate = (data: CreateProductRequest) => {
    setCreateErrors(null);
    createProduct.mutate(data, {
      onSuccess: () => {
        closeCreate();
        notifications.show({
          title: 'Produkt skapad',
          message: `${data.title} har lagts till.`,
          color: 'green',
        });
      },
      onError: (err) => {
        const fieldErrors = getApiErrors(err);
        if (fieldErrors) {
          setCreateErrors(fieldErrors);
        } else {
          notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
        }
      },
    });
  };

  // --- Edit ---
  const openEdit = (product: ProductResponse) => {
    setEditErrors(null);
    setEditProduct(product);
  };

  const closeEdit = () => {
    setEditProduct(null);
    setEditErrors(null);
  };

  const handleUpdate = (data: UpdateProductRequest) => {
    if (!editProduct) return;
    setEditErrors(null);
    updateProduct.mutate(
      { id: editProduct.id, data },
      {
        onSuccess: () => {
          closeEdit();
          notifications.show({
            title: 'Produkt uppdaterad',
            message: `${data.title} har uppdaterats.`,
            color: 'green',
          });
        },
        onError: (err) => {
          const fieldErrors = getApiErrors(err);
          if (fieldErrors) {
            setEditErrors(fieldErrors);
          } else {
            notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
          }
        },
      }
    );
  };

  // --- Delete ---
  const handleDelete = (product: ProductResponse) => {
    if (!window.confirm(`Vill du ta bort "${product.title}"?`)) return;
    deleteProduct.mutate(product.id, {
      onSuccess: () => {
        notifications.show({
          title: 'Produkt borttagen',
          message: `${product.title} har tagits bort.`,
          color: 'green',
        });
      },
      onError: (err) => {
        notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
      },
    });
  };

  // --- Manage (attribut + varianter) ---
  const openManage = (product: ProductResponse) => {
    setManageProduct(product);
  };

  const closeManage = () => {
    setManageProduct(null);
  };

  const handleCreateAttribute = (data: CreateProductAttributeDefinitionRequest) => {
    createAttr.mutate(data, {
      onSuccess: () => {
        notifications.show({
          title: 'Attribut tillagt',
          message: `${data.name} har lagts till.`,
          color: 'green',
        });
      },
      onError: (err) => {
        notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
      },
    });
  };

  const handleDeleteAttribute = (id: number) => {
    if (!window.confirm('Vill du ta bort detta attribut?')) return;
    deleteAttr.mutate(id, {
      onSuccess: () => {
        notifications.show({
          title: 'Attribut borttaget',
          message: 'Attributet har tagits bort.',
          color: 'green',
        });
      },
      onError: (err) => {
        notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
      },
    });
  };

  const handleCreateVariant = (data: CreateProductVariantRequest) => {
    createVariant.mutate(data, {
      onSuccess: () => {
        notifications.show({
          title: 'Variant skapad',
          message: 'Varianten har lagts till.',
          color: 'green',
        });
      },
      onError: (err) => {
        notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
      },
    });
  };

  const handleUpdateVariant = (id: number, data: UpdateProductVariantRequest) => {
    updateVariant.mutate(
      { id, data },
      {
        onSuccess: () => {
          notifications.show({
            title: 'Variant uppdaterad',
            message: 'Varianten har uppdaterats.',
            color: 'green',
          });
        },
        onError: (err) => {
          notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
        },
      }
    );
  };

  const handleDeleteVariant = (id: number) => {
    if (!window.confirm('Vill du ta bort denna variant?')) return;
    deleteVariant.mutate(id, {
      onSuccess: () => {
        notifications.show({
          title: 'Variant borttagen',
          message: 'Varianten har tagits bort.',
          color: 'green',
        });
      },
      onError: (err) => {
        notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
      },
    });
  };

  return {
    products: products ?? [],
    isLoading,
    error,

    createModal: {
      opened: createOpen,
      onClose: closeCreate,
      onSubmit: handleCreate,
      loading: createProduct.isPending,
      errors: createErrors,
    },

    editModal: {
      product: editProduct,
      onClose: closeEdit,
      onSubmit: handleUpdate,
      loading: updateProduct.isPending,
      errors: editErrors,
    },

    manageModal: {
      product: manageProduct,
      onClose: closeManage,
      onCreateAttribute: handleCreateAttribute,
      onDeleteAttribute: handleDeleteAttribute,
      onCreateVariant: handleCreateVariant,
      onUpdateVariant: handleUpdateVariant,
      onDeleteVariant: handleDeleteVariant,
      onImagesChanged: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
      },
      attrLoading: createAttr.isPending,
      variantLoading: createVariant.isPending || updateVariant.isPending,
    },

    openCreate,
    openEdit,
    openManage,
    handleDelete,
    deleteLoading: deleteProduct.isPending,
  };
}