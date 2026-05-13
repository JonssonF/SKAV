import { Container, Title, Button, Group, Loader, Alert } from '@mantine/core';
import { useAdminProducts } from '../../features/shop/hooks/useAdminProducts';
import { ProductsTable } from '../../features/shop/components/ProductsTable';
import { ProductCreateModal } from '../../features/shop/components/ProductCreateModal';
import { ProductEditModal } from '../../features/shop/components/ProductEditModal';
import { ProductManageModal } from '../../features/shop/components/ProductManageModal';

export function AdminProductsPage() {
  const admin = useAdminProducts();

  if (admin.isLoading) {
    return (
      <Container py="xl">
        <Group justify="center"><Loader size="lg" /></Group>
      </Container>
    );
  }

  if (admin.error) {
    return (
      <Container py="xl">
        <Alert color="red" title="Något gick fel">
          Kunde inte hämta produkter.
        </Alert>
      </Container>
    );
  }

  return (
    <Container py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Hantera produkter</Title>
        <Button onClick={admin.openCreate}>Ny produkt</Button>
      </Group>

      <ProductsTable
        products={admin.products}
        onEdit={admin.openEdit}
        onManage={admin.openManage}
        onDelete={admin.handleDelete}
        deleteLoading={admin.deleteLoading}
      />

      <ProductCreateModal {...admin.createModal} />
      <ProductEditModal {...admin.editModal} />
      <ProductManageModal {...admin.manageModal} />
    </Container>
  );
}