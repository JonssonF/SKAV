import { Table, Group, Button, Text, Badge, Image } from '@mantine/core';
import type { ProductResponse } from '../../../types/product.types';

interface ProductsTableProps {
  products: ProductResponse[];
  onEdit: (product: ProductResponse) => void;
  onManage: (product: ProductResponse) => void;
  onDelete: (product: ProductResponse) => void;
  deleteLoading?: boolean;
}

export function ProductsTable({ products, onEdit, onManage, onDelete, deleteLoading }: ProductsTableProps) {
  if (products.length === 0) {
    return <Text c="dimmed">Inga produkter ännu. Skapa den första!</Text>;
  }

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Produkt</Table.Th>
          <Table.Th>Kategori</Table.Th>
          <Table.Th>Pris</Table.Th>
          <Table.Th>Varianter</Table.Th>
          <Table.Th>Totalt lager</Table.Th>
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {products.map((product) => {
          const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);

          return (
            <Table.Tr key={product.id}>
              <Table.Td>
                <Group gap="sm">
                  <Image
                    src={product.imageUrl}
                    w={40}
                    h={40}
                    radius="sm"
                    fallbackSrc="https://placehold.co/40x40?text=?"
                  />
                  <Text size="sm" fw={500}>{product.title}</Text>
                </Group>
              </Table.Td>
              <Table.Td>
                {product.category && (
                  <Badge variant="light" color="gray" size="sm">{product.category}</Badge>
                )}
              </Table.Td>
              <Table.Td>
                <Text size="sm">{product.price} kr</Text>
              </Table.Td>
              <Table.Td>
                <Badge variant="light" size="sm">{product.variants.length}</Badge>
              </Table.Td>
              <Table.Td>
                <Badge
                  variant="light"
                  color={totalStock > 0 ? 'green' : 'red'}
                  size="sm"
                >
                  {totalStock}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Button variant="light" size="xs" onClick={() => onManage(product)}>
                    Varianter
                  </Button>
                  <Button variant="light" size="xs" onClick={() => onEdit(product)}>
                    Redigera
                  </Button>
                  <Button variant="light" color="red" size="xs" onClick={() => onDelete(product)} loading={deleteLoading}>
                    Ta bort
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
}